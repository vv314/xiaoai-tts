const login = require('./login')
const device = require('./device')
const tts = require('./tts')
const { isObject } = require('./utils')

class XiaoAi {
  constructor(user, pwd) {
    if (isObject(user)) {
      const { userId, serviceToken } = user

      if (!userId || !serviceToken) throw new Error('参数不合法')

      this.session = login({ userId, serviceToken })
    } else {
      if (!user || !pwd) throw new Error('参数不合法')

      this.session = login(user, pwd)
    }
  }

  connect() {
    return this.session.then(ss => ({
      userId: ss.userId,
      serviceToken: ss.serviceToken
    }))
  }

  async getDevice(name) {
    return this.session.then(ss => device(ss.cookie))
  }

  async say(msg, deviceId) {
    const ss = await this.session

    if (deviceId) {
      return tts(msg, {
        cookie: ss.cookie,
        deviceId: deviceId
      })
    } else {
      const liveDevice = await device(ss.cookie)

      if (!liveDevice.length) {
        return Promise.resolve('无设备在线')
      }

      return tts(msg, {
        cookie: ss.cookie,
        deviceId: liveDevice[0].deviceID
      })
    }
  }
}

module.exports = XiaoAi
