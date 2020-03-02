const invoke = require('../lib/invoke')

// 切换播放状态
async function togglePlayState(ticket) {
  return invoke(ticket, {
    message: { action: 'toggle', media: 'common' },
    method: 'player_play_operation',
    path: 'mediaplayer'
  })
}

module.exports = togglePlayState
