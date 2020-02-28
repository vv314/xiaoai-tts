const request = require('./request')
const XiaoAiError = require('./XiaoAiError')
const { randomString } = require('./utils')
const { API } = require('./const')

async function getLiveDevice(cookie) {
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

  return rep.data.filter(d => d.presence == 'online')
}

module.exports = getLiveDevice
