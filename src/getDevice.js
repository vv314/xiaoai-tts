const request = require('./lib/request')
const XiaoAiError = require('./XiaoAiError')
const { randomString } = require('./lib/utils')
const { API } = require('./const')

async function getDevice(cookie) {
  const rep = await request({
    url: API.DEVICE_LIST,
    type: 'xiaoai',
    data: {
      master: 1,
      requestId: randomString(30)
    },
    headers: {
      Cookie: cookie
    }
  }).catch(e => {
    throw new XiaoAiError(e)
  })

  if (rep.code != 0) return []

  const onlineDevice = rep.data.filter(d => d.presence == 'online')

  return onlineDevice
}

module.exports = getDevice
