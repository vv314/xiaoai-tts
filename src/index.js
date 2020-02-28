const tts = require('./tts')
const login = require('./login')
const device = require('./device')
const XiaoAiError = require('./XiaoAiError')
const { isObject } = require('./utils')
const { ERR_CODE } = XiaoAiError

class XiaoAi {
  constructor(user, pwd) {
    if (isObject(user)) {
      const { userId, serviceToken } = user

      if (!userId || !serviceToken) throw new XiaoAiError(ERR_CODE.INVALID_ARG)

      this.session = login({ userId, serviceToken })

      return
    }

    if (!user || !pwd) throw new XiaoAiError(ERR_CODE.INVALID_ARG)

    this.session = login(user, pwd)
  }

  async connect() {
    const ss = await this.session

    return {
      userId: ss.userId,
      serviceToken: ss.serviceToken
    }
  }

  async getDevice(name) {
    return this.session.then(ss => device(ss.cookie))
  }

  async say(msg, deviceId) {
    const { cookie } = await this.session

    if (deviceId) {
      return tts(msg, { cookie, deviceId })
    }

    const liveDevice = await device(cookie)

    if (!liveDevice.length) {
      throw new XiaoAiError(ERR_CODE.NO_DEVICE)
    }

    deviceId = liveDevice[0].deviceID

    return tts(msg, { cookie, deviceId })
  }
}

module.exports = XiaoAi
