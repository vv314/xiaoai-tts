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

    this.getDevice()
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

    return devices.find(e => e.includes(name))
  }

  useDevice(deviceId) {
    this.device = deviceId
  }

  async say(msg, deviceId = this.device) {
    const { cookie } = await this.session

    if (deviceId) {
      return tts(msg, { cookie, deviceId })
    }

    const onlineDevices = await this.getDevice()

    if (onlineDevices.length == 0) {
      throw new XiaoAiError(ERR_CODE.NO_DEVICE)
    }

    // 当查询到多个设备，并且未指定设备 id 时，
    // 默认使用第一个作为当前设备
    this.useDevice(onlineDevices[0])

    return tts(msg, { cookie, device: this.device })
  }
}

module.exports = XiaoAi
