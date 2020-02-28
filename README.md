# xiaoai-tts

[![npm](https://img.shields.io/npm/v/xiaoai-tts.svg)](https://www.npmjs.com/package/xiaoai-tts)

小爱音箱自定义文本朗读。

> 启发自 http://www.miui.com/thread-14071212-1-1.html

## 安装

```bash
npm i xiaoai-tts
```

## 使用

```javascript
const XiaoAi = require('xiaoai-tts')

// 输入小米账户名，密码
const client = new XiaoAi('fish', '123456')

// 朗读文本
client.say('你好，我是小爱')
```

## API

### Class: XiaoAi

#### new XiaoAi(username, password)

- `username: string` 小米账户用户名
- `password: string` 账户密码

使用小米账户登录小爱音箱

#### new XiaoAi(session)

使用 `Session` 对象登录。

使用小米账户登录后，调用 `connect()` 返回用户登录凭证——**Session**；
`Session` 可持久化保存，实例化 `XiaoAi` 时可直接传入：

```javascript
const fs = require('fs')
const client = null

try {
  // 尝试读取本地 Session 信息
  const Session = fs.readFileSync('~/xiaoai/session', { encoding: 'utf8' })

  // 通过 Session 登录
  client = new XiaoAi(JSON.parse(Session))
} catch (e) {
  client = new XiaoAi('fish', '123456')

  client.connect().then(Session => {
    // 将 Session 储存到本地
    fs.writeFileSync('~/xiaoai/session', JSON.stringify(Session))
  })
}
```

### instance

XiaoAi 实例对象

#### say(msg)

- Returns: `Promise<ServerResponse>`

朗读指定文本，返回接口调用结果

```javascript
client.say('小爱你好').then(rep => {
  // 服务端接口调用结果
  console.log(rep)
})
```

#### connect()

- Returns: `Promise<Session>`

获取 `Session` 信息

- `Session.userId`: 用户 ID
- `Session.serviceToken`: 用户 token

```javascript
client.connect().then(session => {
  // 用户 Session
  console.log(session)
})
```

#### getDevice(name)

- `name` 过滤设备名称
- Returns: `Promise<LiveDevice[]>`

获取在线设备列表

```javascript
client.getDevice().then(liveDevice => {
  // 在线设备，包含多个设备时，以第一个为当前设备
  console.log(liveDevice)
})
```
