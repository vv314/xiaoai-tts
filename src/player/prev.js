const invoke = require('../lib/invoke')

// 继续播放
async function prev(ticket) {
  return invoke(ticket, {
    message: { action: 'prev', media: 'common' },
    method: 'player_play_operation',
    path: 'mediaplayer'
  })
}

module.exports = prev
