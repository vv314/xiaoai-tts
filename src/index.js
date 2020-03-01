const tts = require('./tts')
const login = require('./login')
const getDevices = require('./getDevices')
const XiaoAiError = require('./lib/XiaoAiError')
const MessageQueue = require('./lib/MessageQueue')
const mediaPlayer = require('./mediaPlayer')
const { ERR_CODE } = XiaoAiError

class XiaoAi {
  /**
   * 构造函数
   * @param  {String | Session} user 用户名或 session
   * @param  {String} [pwd]  密码
   */
  constructor(user, pwd) {
    this.msgQueue = new MessageQueue()
    this.session = login(user, pwd)

    // 可用设备列表
    this.devices = []
    this.deviceId = ''

    this.getDevice().then(devices => {
      if (devices.length == 0 || this.deviceId) return

      this.useDevice(devices[0].deviceID)
    })
  }

  /**
   * 获取 Session
   * @return {Promise<Session>} Session 对象
   */
  async connect() {
    const { userId, serviceToken } = await this.session

    return { userId, serviceToken }
  }

  /**
   * 获取在线设备
   * @param  {String} name  设备名称（别名）
   * @param  {String} [deviceId]  设备 id
   * @return {Promise<Device[]>}  在线设备列表
   */
  async getDevice(name) {
    const { cookie } = await this.session
    const devices = await getDevices(cookie)

    // 更新在线设备
    this.devices = devices

    if (!name) return devices

    return devices.find(e => e.name.includes(name))
  }

  /**
   * 设置当前设备
   * @param  {String} [deviceId]  设备 id
   */
  useDevice(deviceId) {
    this.deviceId = deviceId
  }

  async _call(method, deviceId = this.deviceId, param) {
    const { cookie } = await this.session

    if (deviceId) {
      return method({ cookie, deviceId }, param)
    }

    const devices = await this.getDevice()

    if (devices.length == 0) {
      throw new XiaoAiError(ERR_CODE.NO_DEVICE)
    }

    // 当查询到多个设备，并且未指定设备 id 时，
    // 默认使用第一个作为当前设备
    const targetId = devices[0].deviceID

    // 后续沿用此次查询结果
    this.useDevice(targetId)

    return method({ cookie, deviceId: targetId }, param)
  }

  /**
   * 语音朗读
   * @param  {String} text  文本
   * @param  {String} [deviceId]  设备 id
   * @return {Promise<Response>}  服务端响应
   */
  async say(text, deviceId) {
    return this._call(tts, deviceId, text)
  }

  /**
   * 设置设备音量
   * @param  {Number} volume  音量值
   * @param  {String} [deviceId]  设备 id
   * @return {Promise<Response>}  服务端响应
   */
  async setVolume(volume, deviceId) {
    if (typeof volume != 'number') {
      throw new XiaoAiError(ERR_CODE.INVALID_INPUT)
    }

    return this._call(mediaPlayer.setVolume, deviceId, volume)
  }

  /**
   * 获取设备音量
   * @param  {String} [deviceId]  设备 id
   * @return {Promise<Number>}  音量值
   */
  async getVolume(deviceId) {
    return this._call(mediaPlayer.getVolume, deviceId)
  }

  /**
   * 调高音量，幅度 5
   * @param  {String} [deviceId]  设备 id
   * @return {Promise<Response>} 服务端响应
   */
  async volumeUp(deviceId) {
    return this._call(mediaPlayer.volumeUp, deviceId)
  }

  /**
   * 调低音量，幅度 5
   * @param  {String} [deviceId]  设备 id
   * @return {Promise<Response>} 服务端响应
   */
  async volumeDown(deviceId) {
    return this._call(mediaPlayer.volumeDown, deviceId)
  }

  /**
   * 继续媒体播放
   * @param  {String} [deviceId]  设备 id
   * @return {Promise<Response>} 服务端响应
   */
  async play(deviceId) {
    return this._call(mediaPlayer.play, deviceId)
  }

  /**
   * 暂停媒体播放
   * @param  {String} [deviceId]  设备 id
   * @return {Promise<Response>} 服务端响应
   */
  async pause(deviceId) {
    return this._call(mediaPlayer.pause, deviceId)
  }

  /**
   * 播放上一曲
   * @param  {String} [deviceId]  设备 id
   * @return {Promise<Response>} 服务端响应
   */
  async prev(deviceId) {
    return this._call(mediaPlayer.prev, deviceId)
  }

  /**
   * 播放下一曲
   * @param  {String} [deviceId]  设备 id
   * @return {Promise<Response>} 服务端响应
   */
  async next(deviceId) {
    return this._call(mediaPlayer.next, deviceId)
  }

  /**
   * 切换播放状态(播放/暂停)
   * @param  {String} [deviceId]  设备 id
   * @return {Promise<Response>} 服务端响应
   */
  async togglePlayState(deviceId) {
    return this._call(mediaPlayer.togglePlayState, deviceId)
  }

  /**
   * 获取当前媒体播放状态
   * @param  {String} [deviceId]  设备 id
   * @return {Promise<Response>} 服务端响应
   */
  async getPlayStatus(deviceId) {
    return this._call(mediaPlayer.getPlayStatus, deviceId)
  }
}

module.exports = XiaoAi
