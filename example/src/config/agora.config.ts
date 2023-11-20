let env: any = '';
let localAppId = '';
try {
  env = require('./env_local').default;
  console.log('appID', localAppId);
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
};

export default config;
