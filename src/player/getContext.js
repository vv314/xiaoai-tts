const { ubus } = require('../lib/invoke')
const parseJson = require('../lib/parseBigIntJson')

// 获取当前播信息
async function getContext(ticket) {
  const data = await ubus(ticket, {
    method: 'player_get_context',
    path: 'mediaplayer'
  })

  return parseJson(data.info)
}

module.exports = getContext
