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

const client = new XiaoAi('username', 'password')

// 朗读文本
client.say('hello world')

// 获取设备列表
client.getDevice().then(deviceList => console.log(deviceList))

// 获取 session 信息
// 可持久化保存 session
client.connect().then(session => console.log(session))
```

## API

### Class: XiaoAi

#### new XiaoAi(username, password)

- `username: string` 小米账户用户名
- `password: string` 账户密码

使用小米账户登录小爱音箱

#### new XiaoAi(session)

使用 `Session` 对象登录。

使用小米账户登录后，可通过 `connect()` 方法获取 **Session** 信息，Session 对象包含以下属性：

- `userId: string` 用户 ID
- `serviceToken: string` 用户授权 token

Session 可序列化保存在本地，下次登录时可直接使用此对象实例化 `XiaoAi`。

### instance

XiaoAi 实例对象

#### say(msg)

- Returns: `Promise<Response>`

朗读指定文本，返回接口调用结果

#### connect()

- Returns: `Promise<Session>`

获取 `Session` 信息。

#### getDevice(name)

- `name` 过滤设备名称
- Returns: `Promise<Device[]>`

获取设备列表
