let env: any = '';
let localAppId = '';
try {
  env = require('./env_local').default;
} catch (error) {
  console.warn(error);
}

const config = {
  // Get your own App ID at https://dashboard.agora.io/
  appId: localAppId || env.appId,
  // Please refer to https://docs.agora.io/en/Agora%20Platform/token
  token: env.token || localAppId || '',
  channelName: env.channelName || 'rtmtestrn',
  uid: env.uid,
  logFilePath: '',
  server: '',
  port: 0,
  proxyType: 0,
  account: 'ds',
  password: 'ssds',
  areaCode: 4294967295,
  encryptionMode: 0,
  encryptionKey: '',
  encryptionSalt: new Array(32).fill(1, 0, 32),
};

export default config;
