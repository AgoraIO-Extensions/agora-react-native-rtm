import {
  RTMClient,
  RTMProvider,
  RtmConfig,
  RtmEncryptionConfig,
  RtmProxyConfig,
  createAgoraRtmClient,
} from 'agora-react-native-rtm';
import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

import Config from '../config/agora.config';
interface ClientProps {
  children: ReactNode;
}

export const Client = ({ children }: ClientProps) => {
  const [client] = useState<RTMClient>(() =>
    createAgoraRtmClient(
      new RtmConfig({
        userId: Config.uid,
        appId: Config.appId,
        areaCode: Config.areaCode,
        proxyConfig: new RtmProxyConfig({
          proxyType: Config.proxyType,
          server: Config.server,
          port: Config.port,
          account: Config.account,
          password: Config.password,
        }),
        encryptionConfig: new RtmEncryptionConfig({
          encryptionMode: Config.encryptionMode,
          encryptionKey: Config.encryptionKey,
          encryptionSalt: Config.encryptionSalt,
        }),
        // eventHandler: {
        //   onLoginResult: () => {
        //     console.log('onLoginResult');
        //   },
        // },
      })
    )
  );

  useEffect(() => {
    return () => {
      client.release();
    };
  }, [client]);

  return <RTMProvider client={client}>{children}</RTMProvider>;
};

export default Client;
