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

- `username` `{String}` 小米账户用户名
- `password` `{String}` 账户密码

使用小米账户登录小爱音箱

#### new XiaoAi(session)

- `session` `{Object}` Session 信息
  - `userId` `{String}`
  - `serviceToken` `{String}`

使用 `Session` 登录。

使用小米账户登录后，调用 `connect()` 返回用户登录信息；
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

#### say(text)

- `text` `{String}` 文本信息
- Returns: `{Promise<Response>}`

朗读指定文本，返回接口调用结果

```javascript
client.say('你好，我是小爱')
```

#### getDevice([name])

- `name` `{String}` 设备名称(别名)
- Returns: `{Promise<Promise<Object[] | Object | null>}` 设备信息

获取**在线**设备列表

```javascript
// 获取所有在线设备
const onlineDevices = await client.getDevice()

// 获取单个设备，未找到时返回 null
const roomDevice = await client.getDevice('卧室小爱')
```

#### useDevice(deviceId)

- `deviceId` `{String}` 设备 id

切换指定设备。`xiaomi-tts` 实例化后默认使用 `getDevice()` 方法返回的第一个设备，可使用此方法切换为指定设备。

```javascript
const roomDevice = await client.getDevice('卧室小爱')

// 使用“卧室小爱”
client.useDevice(roomDevice.deviceID)

client.say('你好，我是卧室的小爱')
```

#### connect()

- Returns: `{Promise<Session>}` session 信息
  - `Session.userId` `{String}`
  - `Session.serviceToken` `{String}`

获取 `Session` 信息

```javascript
const Session = await client.connect()
```

### 媒体控制

#### setVolume(volume)

- `volume` `{Number}` 音量值
- Returns: `{Promise<Response>}`

设置音量

```javascript
client.setVolume(30)
```

#### getVolume()

- Returns: `{Promise<Number>}` 音量值

获取音量

```javascript
const volume = await client.getVolume()
```

#### volumeUp()

- Returns: `{Promise<Response>}`

调高音量，幅度 5

#### volumeDown()

- Returns: `{Promise<Response>}`

调低音量，幅度 5

#### getPlayStatus()

- Returns: `{Promise<Response>}` 状态信息

获取当前媒体播放状态

#### getPlaySong()

- Returns: `{Promise<Response | null>}` 媒体信息

获取正在播放的媒体信息

#### play()

- Returns: `{Promise<Response>}`

继续播放媒体

#### pause()

- Returns: `{Promise<Response>}`

暂停播放媒体

#### togglePlayState()

- Returns: `{Promise<Response>}`

切换播放状态(播放/暂停)

#### prev()

- Returns: `{Promise<Response>}`

播放上一曲

#### next()

- Returns: `{Promise<Response>}`

播放下一曲
