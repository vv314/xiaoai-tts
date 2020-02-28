// mock app device id
const APP_DEVICE_ID = '3C861A5820190429'
const SDK_VER = '3.4.1'
const APP_VER = '2.0.10'

const API = {
  USBS: 'https://api.mina.mi.com/remote/ubus',
  SERVICE_AUTH: 'https://account.xiaomi.com/pass/serviceLoginAuth2',
  SERVICE_LOGIN: 'https://account.xiaomi.com/pass/serviceLogin',
  DEVICE_LIST: 'https://api.mina.mi.com/admin/v2/device_list'
}

module.exports = {
  API,
  APP_VER,
  APP_DEVICE_ID,
  SDK_VER
}
