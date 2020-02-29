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
let client = null

try {
  // 尝试读取本地 Session 信息
  const Session = fs.readFileSync('~/xiaoai/session', { encoding: 'utf8' })

  // 通过 Session 登录
  client = new XiaoAi(JSON.parse(Session))
} catch (e) {
  client = new XiaoAi('fish', '123456')

  const Session = await client.connect()

  // 将 Session 储存到本地
  fs.writeFileSync('~/xiaoai/session', JSON.stringify(Session))
}
```

### instance

XiaoAi 实例对象

#### say(message[, deviceId])

- `message: string` tts 文本信息
- `[deviceId]: string` 可选，设备 id
- Returns: `Promise<ServerResponse>`

朗读指定文本，返回接口调用结果

```javascript
// rep 为服务器响应结果
const rep = await client.say('你好，我是小爱')

// 强制指定设备朗读（仅限本次会话）
client.say('你好，我是卧室的小爱', '5a82xxxx-0d07-480e-xxxx-2b5ccxxxx7dc')
```

#### getDevice(name)

- `name` 过滤设备名称
- Returns: `Promise<Device[]>`

获取**在线**设备列表

```javascript
// 获取所有在线设备
const onlineDevices = await client.getDevice()

// 获取指定设备信息
const roomDevice = await client.getDevice('卧室小爱')
```

#### useDevice(deviceId)

- `deviceId: string` 设备 id

设置当前设备，后续会话将沿用此设备

```javascript
const roomDevice = await client.getDevice('卧室小爱')

// 设置当前设备
client.useDevice(roomDevice.deviceID)

client.say('你好，我是卧室的小爱')
```

#### connect()

- Returns: `Promise<Session>`

获取 `Session` 信息

- `Session.userId`: 用户 ID
- `Session.serviceToken`: 用户 token

```javascript
const Session = await client.connect()
```
