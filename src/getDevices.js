const request = require('./lib/request')
const XiaoAiError = require('./XiaoAiError')
const { randomString } = require('./lib/utils')
const { API } = require('./const')

async function getDevices(cookie, master = 1) {
  const rep = await request({
    url: API.DEVICE_LIST,
    type: 'xiaoai',
    data: {
      master: master,
      requestId: randomString(30)
    },
    headers: {
      Cookie: cookie
    }
  }).catch(e => {
    throw new XiaoAiError(e)
  })

  if (rep.code != 0) return []

  const liveDevices = rep.data.filter(d => d.presence == 'online')

  return liveDevices
}

module.exports = getDevices
