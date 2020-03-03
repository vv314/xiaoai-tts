const { ubus } = require('../lib/invoke')

// 暂停播放
async function pause(ticket) {
  return ubus(ticket, {
    message: { action: 'pause' },
    method: 'player_play_operation',
    path: 'mediaplayer'
  })
}

module.exports = pause
