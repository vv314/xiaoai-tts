const togglePlayState = require('./togglePlayState')
const getPlaylistSongs = require('./getPlaylistSongs')
const playAlbumPlaylist = require('./playAlbumPlaylist')
const getSongInfo = require('./getSongInfo')
const getPlaylist = require('./getPlaylist')
const setPlayLoop = require('./setPlayLoop')
const getStatus = require('./getStatus')
const getVolume = require('./getVolume')
const setVolume = require('./setVolume')
const pause = require('./pause')
const play = require('./play')
const prev = require('./prev')
const next = require('./next')

const VOLUME_STEP = 5

// 调大声音
async function volumeUp(ticket) {
  const volume = await getVolume(ticket)

  return setVolume(ticket, volume + VOLUME_STEP)
}

// 调小声音
async function volumeDown(ticket) {
  const volume = await getVolume(ticket)

  return setVolume(ticket, volume - VOLUME_STEP)
}

async function playSongs() {}

module.exports = {
  getStatus,
  volumeDown,
  volumeUp,
  play,
  next,
  prev,
  pause,
  getVolume,
  setVolume,
  setPlayLoop,
  getSongInfo,
  getPlaylist,
  togglePlayState,
  getPlaylistSongs,
  playAlbumPlaylist
}
