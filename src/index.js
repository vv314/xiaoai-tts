const tts = require('./tts')
const login = require('./login')
const getDevice = require('./getDevice')
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
    // 可用设备列表
    this.devices = []
    this.currDevice = null
    this.msgQueue = new MessageQueue()

    this.session = login(user, pwd).then(async session => {
      this.devices = await getDevice(session.cookie)

      if (!this.devices.length) return session

      this.currDevice = this.devices[0]

      return login.switchSessionDevice(session, this.currDevice)
    })
  }

  /**
   * 获取 Session
   * @return {Promise<Session>} Session 对象
   */
  async connect() {
    let session = await this.session

    session = Object.assign({}, session)
    delete session.cookie

    return session
  }

  /**
   * 获取在线设备
   * @param  {String} name  设备名称（别名）
   * @param  {String} [deviceId]  设备
   * @return {Promise<Device[] | Device | null>}  在线设备列表
   */
  async getDevice(name) {
    const { cookie } = await this.session
    const devices = await getDevice(cookie)

    // 更新在线设备
    this.devices = devices

    if (!name) return devices

    const target = devices.find(e => e.name.includes(name))

    return target ? target : null
  }

  /**
   * 使用指定设备
   * @param  {String} [deviceId]  设备
   */
  async useDevice(deviceId) {
    let session = await this.session
    const devices = await getDevice(session.cookie)
    const device = devices.find(e => e.deviceID == deviceId)

    if (!device) {
      throw new XiaoAiError(ERR_CODE.NO_DEVICE)
    }

    session = login.switchSessionDevice(session, device)

    this.currDevice = device
    this.session = Promise.resolve(session)
  }

  async _call(method, param) {
    if (this.currDevice) {
      const { cookie } = await this.session
      const { deviceID } = this.currDevice

      return method({ cookie, deviceId: deviceID }, param)
    }

    const devices = await this.getDevice()

    if (devices.length == 0) {
      throw new XiaoAiError(ERR_CODE.NO_DEVICE)
    }

    // 当查询到多个设备，并且未指定设备 时，
    // 默认使用第一个作为当前设备
    const device = devices[0]

    // 后续沿用此次查询结果
    await this.useDevice(device.deviceID)

    // 确保在 useDevice 成功后获取
    const { cookie } = await this.session

    return method({ cookie, deviceId: device.deviceID }, param)
  }

  /**
   * 语音朗读
   * @param  {String} text  文本
   * @return {Promise<Response>}  服务端响应
   */
  async say(text) {
    return this._call(tts, text)
  }

  /**
   * 设置设备音量
   * @param  {Number} volume  音量值
   * @return {Promise<Response>}  服务端响应
   */
  async setVolume(volume) {
    if (typeof volume != 'number') {
      throw new XiaoAiError(ERR_CODE.INVALID_INPUT)
    }

    return this._call(mediaPlayer.setVolume, volume)
  }

  /**
   * 获取设备音量
   * @return {Promise<Number>}  音量值
   */
  async getVolume() {
    return this._call(mediaPlayer.getVolume)
  }

  /**
   * 调高音量，幅度 5
   * @return {Promise<Response>} 服务端响应
   */
  async volumeUp() {
    return this._call(mediaPlayer.volumeUp)
  }

  /**
   * 调低音量，幅度 5
   * @return {Promise<Response>} 服务端响应
   */
  async volumeDown() {
    return this._call(mediaPlayer.volumeDown)
  }

  /**
   * 继续媒体播放
   * @return {Promise<Response>} 服务端响应
   */
  async play() {
    return this._call(mediaPlayer.play)
  }

  /**
   * 暂停媒体播放
   * @return {Promise<Response>} 服务端响应
   */
  async pause() {
    return this._call(mediaPlayer.pause)
  }

  /**
   * 播放上一曲
   * @return {Promise<Response>} 服务端响应
   */
  async prev() {
    return this._call(mediaPlayer.prev)
  }

  /**
   * 播放下一曲
   * @return {Promise<Response>} 服务端响应
   */
  async next() {
    return this._call(mediaPlayer.next)
  }

  /**
   * 切换播放状态(播放/暂停)
   * @return {Promise<Response>} 服务端响应
   */
  async togglePlayState() {
    return this._call(mediaPlayer.togglePlayState)
  }

  /**
   * 获取当前媒体播放状态
   * @return {Promise<Response>} 服务端响应
   */
  async getPlayStatus() {
    return this._call(mediaPlayer.getPlayStatus)
  }

  /**
   * 获取当前播放媒体信息
   * @return {Promise<Object | null>} 媒体信息
   *
   */
  async getPlaySong() {
    return this._call(mediaPlayer.getPlaySong)
  }
}

module.exports = XiaoAi
