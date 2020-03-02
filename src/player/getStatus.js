const invoke = require('../lib/invoke')
const { parseJson } = require('../lib/utils')

// 获取当前播放状态
async function getStatus(ticket) {
  const data = await invoke(ticket, {
    path: 'mediaplayer',
    method: 'player_get_play_status'
  })

  return parseJson(data.info)
}

module.exports = getStatus
