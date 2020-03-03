const { ubus } = require('../lib/invoke')

// 继续播放
async function next(ticket) {
  return ubus(ticket, {
    message: { action: 'next' },
    method: 'player_play_operation',
    path: 'mediaplayer'
  })
}

module.exports = next
