const { ubus } = require('../lib/invoke')
const { parseJson } = require('../lib/utils')

// 获取当前播放状态
async function getStatus(ticket) {
  const data = await ubus(ticket, {
    method: 'player_get_play_status',
    path: 'mediaplayer'
  })

  return parseJson(data.info)
}

module.exports = getStatus
