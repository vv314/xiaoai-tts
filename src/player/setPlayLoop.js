const { ubus } = require('../lib/invoke')

// 设置音量
// type: 0 单曲循环，1 列表循环，3 列表随机
async function setPlayLoop(ticket, type = 1) {
  return ubus(ticket, {
    message: { type },
    method: 'player_set_loop',
    path: 'mediaplayer'
  })
}

module.exports = setPlayLoop
