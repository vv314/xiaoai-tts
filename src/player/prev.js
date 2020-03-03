const { ubus } = require('../lib/invoke')

// 继续播放
async function prev(ticket) {
  return ubus(ticket, {
    message: { action: 'prev' },
    method: 'player_play_operation',
    path: 'mediaplayer'
  })
}

module.exports = prev
