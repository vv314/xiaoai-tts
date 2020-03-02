const invoke = require('../lib/invoke')

// 播放专辑
async function playAlbum(ticket, albumPlaylistId) {
  return invoke(ticket, {
    method: 'player_play_album_playlist',
    path: 'mediaplayer',
    message: {
      type: 1,
      // 专辑列表 id
      id: albumPlaylistId,
      // 播放起始位置
      startOffset: 1,
      media: 'common'
    }
  })
}

module.exports = playAlbum
