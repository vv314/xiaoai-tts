const tts = require('./tts')
const login = require('./login')
const player = require('./player')
const getDevice = require('./getDevice')
const XiaoAiError = require('./lib/XiaoAiError')
const MessageQueue = require('./lib/MessageQueue')
const { isObject, likeDeviceId } = require('./lib/utils')
const { ERR_CODE } = XiaoAiError

class XiaoAi {
  /**
   * 构造函数
   * @param  {String | Session} user 用户名或 session
   * @param  {String} [pwd]  密码
   */
  constructor(user, pwd) {
    this.currDevice = null
    this.msgQueue = new MessageQueue()

    this.session = login(user, pwd).then(async (session) => {
      if (session.deviceId) {
        this.currDevice = session.deviceId

        return session
      }

      const devices = await getDevice(session.cookie)
      const liveDevice = devices.filter((d) => d.presence == 'online')

      if (liveDevice.length == 0) return session

      this.currDevice = liveDevice[0]

      return session.setDevice(this.currDevice)
    })

    this.player = player
  }

  async test() {
    return this.say('连接测试')
  }

  /**
   * 获取 Session
   * @return {Promise<Session>} Session 对象
   */
  async connect() {
    const { userId, serviceToken, deviceId, serialNumber } = await this.session

    return {
      userId,
      serviceToken,
      deviceId,
      serialNumber
    }
  }

  /**
   * 获取在线设备
   * @param   {deviceName | deviceId} name  设备名称（别名）或设备 ID
   * @return {Promise<Device[]>}  在线设备列表
   */
  async getDevice(name) {
    const devices = await this.getAllDevice(name)
    const isOnline = (d) => d.presence == 'online'

    console.log('devices', devices)

    return devices.filter(isOnline)
  }

  /**
   * 获取全部设备
   * @param  {deviceName | deviceId} name  设备名称（别名）或设备 ID
   * @return {Promise<Device[]>}  设备列表
   */
  async getAllDevice(name) {
    const { cookie } = await this.session
    const devices = await getDevice(cookie)

    if (!name) return devices

    return devices.filter((e) => {
      if (likeDeviceId(name)) {
        return e.deviceID == name
      }

      return e.name.includes(name)
    })
  }

  /**
   * 使用指定设备
   * @param  {String} name  设备名或设备 ID
   */
  async useDevice(name, isTrusted) {
    let session = await this.session
    let device

    if (isObject(name) && isTrusted) {
      device = name
    } else {
      const list = await this.getDevice(name)

      device = list[0]
    }

    if (!device) {
      throw new XiaoAiError(ERR_CODE.NO_DEVICE, { name })
    }

    this.currDevice = device

    session.setDevice(this.currDevice)

    return this.currDevice
  }

  async _call(method, ...args) {
    const { cookie, deviceId } = await this.session
    const ticket = { cookie, deviceId }

    return method.apply(null, [ticket, ...args])
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

    return this._call(player.setVolume, volume)
  }

  /**
   * 获取设备音量
   * @return {Promise<Number>}  音量值
   */
  async getVolume() {
    return this._call(player.getVolume)
  }

  /**
   * 调高音量，幅度 5
   * @return {Promise<Response>} 服务端响应
   */
  async volumeUp() {
    return this._call(player.volumeUp)
  }

  /**
   * 调低音量，幅度 5
   * @return {Promise<Response>} 服务端响应
   */
  async volumeDown() {
    return this._call(player.volumeDown)
  }

  /**
   * 继续媒体播放
   * @return {Promise<Response>} 服务端响应
   */
  async play() {
    return this._call(player.play)
  }

  /**
   * 暂停媒体播放
   * @return {Promise<Response>} 服务端响应
   */
  async pause() {
    return this._call(player.pause)
  }

  /**
   * 播放上一曲
   * @return {Promise<Response>} 服务端响应
   */
  async prev() {
    return this._call(player.prev)
  }

  /**
   * 播放下一曲
   * @return {Promise<Response>} 服务端响应
   */
  async next() {
    return this._call(player.next)
  }

  /**
   * 切换播放状态(播放/暂停)
   * @return {Promise<Response>} 服务端响应
   */
  async togglePlayState() {
    const status = await this._call(player.getStatus)

    if (status.status == 1) {
      return this._call(player.pause)
    }

    return this._call(player.play)
  }

  /**
   * 获取设备运行状态
   * @return {Promise<Response>} 服务端响应
   *
   * Response.status: 1: 播放，2 暂停，3 空闲
   * Response.volume: number 音量
   * Response.loop_type: number 循环类型，0 单曲循环，1 列表循环，3 列表随机
   * Response.media_type: 4 媒体类型
   * Response.play_song_detail: SongDetail
   * SongDetail.global_id: string 媒体 id
   * SongDetail.cp_origin: string 来源，qingting 蜻蜓FM
   * SongDetail.cp_id: string 来源 id
   * SongDetail.category: string 类别
   * SongDetail.duration: number 时长
   * SongDetail.position: number 进度
   * Response.track_list: string[] 列表
   * Response.extra_track_list: trackInfo[]
   * trackInfo.global_id: string
   * trackInfo.cp_origin: string qingting
   * trackInfo.cp_id: string
   * trackInfo.category: string
   */
  async getStatus() {
    return this._call(player.getStatus)
  }

  /**
   * 查询歌曲信息
   * @param  {String} songId  歌单 id
   * @return {Promise<Object | null>} 媒体信息
   */
  async getSongInfo(songId) {
    if (!songId) throw new XiaoAiError(ERR_CODE.INVALID_INPUT)

    return this._call(player.getSongInfo, songId)
  }

  /**
   * 获取我的歌单
   * @param  {String} listId  歌单 id
   * @return {Promise<Object[]>}
   */
  async getMyPlaylist(listId) {
    return this._call(player.getMyPlaylist, listId)
  }

  /**
   * 获取我的歌单
   * @param  {String} url 音频地址
   * @return {Promise<Object[]>}
   */
  async playUrl(url) {
    return this._call(player.playUrl, url)
  }
}

module.exports = XiaoAi
