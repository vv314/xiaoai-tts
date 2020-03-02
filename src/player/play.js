const invoke = require('../lib/invoke')

// 继续播放
async function play(ticket) {
  return invoke(ticket, {
    message: { action: 'play', media: 'common' },
    method: 'player_play_operation',
    path: 'mediaplayer'
  })
}

module.exports = play
