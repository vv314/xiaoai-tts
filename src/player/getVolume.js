const getStatus = require('./getStatus')

// 获取音量
async function getVolume(ticket) {
  const status = await getStatus(ticket)

  return status.volume
}

module.exports = getVolume
