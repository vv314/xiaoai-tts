const request = require('./lib/request')
const XiaoAiError = require('./lib/XiaoAiError')
const { randomString } = require('./lib/utils')
const { API } = require('./const')

async function getDevice(cookie) {
  const rep = await request({
    url: API.DEVICE_LIST,
    data: {
      master: cookie.indexOf('deviceId') < 0 ? 1 : 0,
      requestId: randomString(30)
    },
    headers: {
      Cookie: cookie
    }
  }).catch(e => {
    throw new XiaoAiError(e)
  })

  if (rep.code != 0) {
    throw new XiaoAiError(rep.code, rep.message)
  }

  const liveDevices = rep.data.filter(d => d.presence == 'online')

  return liveDevices
}

module.exports = getDevice
