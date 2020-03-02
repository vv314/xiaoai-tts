const invoke = require('../lib/invoke')

// 暂停播放
async function pause(ticket) {
  return invoke(ticket, {
    message: { action: 'pause', media: 'common' },
    method: 'player_play_operation',
    path: 'mediaplayer'
  })
}

module.exports = pause
