const { ubus } = require('../lib/invoke')

// 播放在线媒体
async function playUrl(ticket, url = '', type = 1) {
  return ubus(ticket, {
    message: { url, type, media: 'app_ios' },
    method: 'player_play_url',
    path: 'mediaplayer'
  })
}

module.exports = playUrl
