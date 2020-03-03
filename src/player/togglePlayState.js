const { ubus } = require('../lib/invoke')

// 切换播放状态
async function togglePlayState(ticket) {
  return ubus(ticket, {
    message: { action: 'toggle' },
    method: 'player_play_operation',
    path: 'mediaplayer'
  })
}

module.exports = togglePlayState
