const tts = require('./tts')
const login = require('./login')
const getDevice = require('./getDevice')
const XiaoAiError = require('./XiaoAiError')
const MessageQueue = require('./lib/MessageQueue')
const { ERR_CODE } = XiaoAiError

class XiaoAi {
  constructor(user, pwd) {
    this.msgQueue = new MessageQueue()
    this.session = login(user, pwd)
    this.deviceId = ''

    this.getDevice().then(devices => {
      if (devices.length == 0 || this.deviceId) return

      this.useDevice(devices[0].deviceID)
    })
  }

  async connect() {
    const ss = await this.session

    return {
      userId: ss.userId,
      serviceToken: ss.serviceToken
    }
  }

  async getDevice(name) {
    const { cookie } = await this.session
    const devices = await getDevice(cookie)

    if (!name) return devices

    return devices.find(e => e.name.includes(name))
  }

  useDevice(deviceId) {
    this.deviceId = deviceId
  }

  async say(msg, deviceId = this.deviceId) {
    const { cookie } = await this.session

    if (deviceId) {
      return tts(msg, { cookie, deviceId })
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

    return tts(msg, { cookie, deviceId: targetId })
  }
}

module.exports = XiaoAi
