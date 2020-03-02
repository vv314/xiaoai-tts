const request = require('../lib/request')
const XiaoAiError = require('../lib/XiaoAiError')
const { randomString } = require('../lib/utils')
const { API } = require('../const')

async function getPlaylist(ticket, { listId, count, offet = 0 } = {}) {
  console.log('listId', listId)
  const rep = await request({
    url: API.PLAYLIST,
    data: {
      listId,
      count,
      offet,
      requestId: randomString(30)
    },
    headers: {
      Cookie: ticket.cookie
    }
  }).catch(e => {
    throw new XiaoAiError(e)
  })

  if (rep.code != 0) {
    throw new XiaoAiError(rep.code, rep.message)
  }

  return rep.data
}

module.exports = getPlaylist
