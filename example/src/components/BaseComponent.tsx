import { RTM_ERROR_CODE, RtmConfig } from 'agora-react-native-rtm';
import React, { useCallback, useEffect, useState } from 'react';

import Config from '../config/agora.config';
import { useRtmClient } from '../hooks/useRtmClient';
import * as log from '../utils/log';

import { AgoraButton, AgoraStyle, AgoraTextInput, AgoraView } from './ui';

interface Props {
  onUidChanged?: (value: string) => void;
  onChannelNameChanged?: (value: string) => void;
}

export default function BaseComponent({
  onUidChanged,
  onChannelNameChanged,
}: Props) {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [cName, setCName] = useState<string>(Config.channelName);
  const [uid, setUid] = useState<string>(Config.uid);

  const onLoginResult = useCallback((errorCode: RTM_ERROR_CODE) => {
    log.log('onLoginResult', 'errorCode', errorCode);
    setLoginSuccess(errorCode === RTM_ERROR_CODE.RTM_ERROR_OK);
  }, []);

  /**
   * Step 1: getRtmClient
   */
  const client = useRtmClient();

  /**
   * Step 2: initialize rtm client and login
   */
  useEffect(() => {
    if (!uid || uid.length === 0) {
      return;
    }
    client.initialize(
      new RtmConfig({
        userId: uid,
        appId: Config.appId,
      })
    );

    return () => {
      setLoginSuccess(false);
      client.release();
    };
  }, [client, uid]);

  useEffect(() => {
    client.addEventListener('onLoginResult', onLoginResult);

    return () => {
      client.removeEventListener('onLoginResult', onLoginResult);
    };
  }, [client, uid, onLoginResult]);

  /**
   * Step 3: login to rtm
   */
  const login = () => {
    client.login(Config.token);
  };

  /**
   * Step 4 (Optional): logout
   */
  const logout = () => {
    client.logout();
    setLoginSuccess(false);
  };

  return (
    <AgoraView style={AgoraStyle.fullWidth}>
      <AgoraTextInput
        onChangeText={(text) => {
          setUid(text);
          onUidChanged?.(text);
        }}
        placeholder="please input userId"
        label="userId"
        value={uid}
        disabled={loginSuccess}
      />
      <AgoraButton
        title={`${loginSuccess ? 'logout' : 'login'}`}
        onPress={() => {
          loginSuccess ? logout() : login();
        }}
      />
      <AgoraTextInput
        onChangeText={(text) => {
          setCName(text);
          onChannelNameChanged?.(text);
        }}
        label="channelName"
        placeholder="please input channelName"
        value={cName}
        disabled={loginSuccess}
      />
    </AgoraView>
  );
}
