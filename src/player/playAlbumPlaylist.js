const { ubus } = require('../lib/invoke')

// 播放专辑
async function playAlbumPlaylist(
  ticket,
  { type = 1, playlistId, startOffset = 0 }
) {
  return ubus(ticket, {
    method: 'player_play_album_playlist',
    path: 'mediaplayer',
    message: {
      type: 1,
      // 专辑列表 id
      id: playlistId,
      // 播放起始位置
      startOffset: 1,
      media: 'common'
    }
  })
}

module.exports = playAlbumPlaylist
