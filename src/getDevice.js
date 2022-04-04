const invoke = require('./lib/invoke')
const { API } = require('./const')

async function getAllDevice(cookie) {
  return invoke({
    url: API.DEVICE_LIST,
    data: {
      master: cookie.indexOf('deviceId') < 0 ? 1 : 0
    },
    cookie
  })
}

module.exports = getAllDevice
