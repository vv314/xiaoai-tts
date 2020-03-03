const { ubus } = require('../lib/invoke')

// 继续播放
async function play(ticket) {
  return ubus(ticket, {
    message: { action: 'play' },
    method: 'player_play_operation',
    path: 'mediaplayer'
  })
}

module.exports = play
