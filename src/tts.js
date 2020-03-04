const { ubus } = require('./lib/invoke')
const parseJson = require('./lib/parseBigIntJson')

async function tts(ticket, text = '') {
  const data = await ubus(ticket, {
    method: 'text_to_speech',
    // 确保 text 为 string
    message: { text: `${text}`, save: 0 },
    path: 'mibrain'
  })

  return parseJson(data.info)
}

module.exports = tts
