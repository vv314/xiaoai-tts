const invoke = require('../lib/invoke')

// 继续播放
async function next(ticket) {
  return invoke(ticket, {
    message: { action: 'next', media: 'common' },
    method: 'player_play_operation',
    path: 'mediaplayer'
  })
}

module.exports = next
