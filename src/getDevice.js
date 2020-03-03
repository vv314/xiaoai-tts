const invoke = require('./lib/invoke')
const { API } = require('./const')

async function getDevice(cookie) {
  const data = await invoke({
    url: API.DEVICE_LIST,
    data: {
      master: cookie.indexOf('deviceId') < 0 ? 1 : 0
    },
    cookie
  })

  const liveDevices = data.filter(d => d.presence == 'online')

  return liveDevices
}

module.exports = getDevice
