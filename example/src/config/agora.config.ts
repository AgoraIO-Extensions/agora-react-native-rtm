import {
  RTM_AREA_CODE,
  RTM_ENCRYPTION_MODE,
  RTM_PROXY_TYPE,
} from 'agora-react-native-rtm';

let env: any = '';
try {
  env = require('./env_local').default;
} catch (error) {
  console.warn(error);
}

const config = {
  // Get your own App ID at https://dashboard.agora.io/
  appId: env.appId,
  // Please refer to https://docs.agora.io/en/Agora%20Platform/token
  token: env.token || '',
  channelName: env.channelName || 'rtmtestrn',
  uid: env.uid,
  logFilePath: '',
  server: '',
  port: 0,
  proxyType: RTM_PROXY_TYPE.RTM_PROXY_TYPE_NONE,
  account: 'ds',
  password: 'ssds',
  areaCode: RTM_AREA_CODE.RTM_AREA_CODE_GLOB,
  encryptionMode: RTM_ENCRYPTION_MODE.RTM_ENCRYPTION_MODE_NONE,
  encryptionKey: '',
  encryptionSalt: new Array(32).fill(1, 0, 32),
};

export default config;
