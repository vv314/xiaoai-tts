const request = require('./request')
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
  })

  if (rep.code == 0) {
    return rep.data.filter(d => d.presence == 'online')
  } else {
    return []
  }
}

module.exports = getLiveDevice
