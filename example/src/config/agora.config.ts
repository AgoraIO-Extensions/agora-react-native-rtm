import {
  RtmAreaCode,
  RtmEncryptionMode,
  RtmProxyType,
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
  proxyType: RtmProxyType.none,
  account: 'ds',
  password: 'ssds',
  areaCode: RtmAreaCode.glob,
  encryptionMode: RtmEncryptionMode.none,
  encryptionKey: '',
  encryptionSalt: new Array(32).fill(1, 0, 32),
};

export default config;
