import { useNavigation } from '@react-navigation/native';
import { RTM_ERROR_CODE, RtmConfig } from 'agora-react-native-rtm';
import React, { useCallback, useEffect, useState } from 'react';

import Config from '../config/agora.config';
import { useRtmClient } from '../hooks/useRtmClient';
import * as log from '../utils/log';

import { LogSink } from './LogSink';
import { AgoraButton, AgoraStyle, AgoraTextInput, AgoraView } from './ui';

interface Props {
  onUidChanged?: (value: string) => void;
  onChannelNameChanged?: (value: string) => void;
}

const Header = ({ getData }: { getData: () => Array<string> }) => {
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <>
      <AgoraButton title="Logs" onPress={toggleOverlay} />
      <LogSink
        visible={visible}
        data={getData()}
        onBackdropPress={toggleOverlay}
      />
    </>
  );
};

export default function BaseComponent({
  onUidChanged,
  onChannelNameChanged,
}: Props) {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [initResult, setInitResult] = useState<number>(0);
  const [cName, setCName] = useState<string>(Config.channelName);
  const [uid, setUid] = useState<string>(Config.uid);
  const navigation = useNavigation();

  const onLoginResult = useCallback((errorCode: RTM_ERROR_CODE) => {
    log.log('onLoginResult', 'errorCode', errorCode);
    setLoginSuccess(errorCode === RTM_ERROR_CODE.RTM_ERROR_OK);
  }, []);

  useEffect(() => {
    const headerRight = () => <Header getData={() => log.logSink._data} />;
    navigation.setOptions({ headerRight });
  }, [navigation]);

  useEffect(() => {
    return () => {
      log.logSink.clearData();
    };
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
    let result = client.initialize(
      new RtmConfig({
        userId: uid,
        appId: Config.appId,
      })
    );
    setInitResult(result);
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
        disabled={!uid || initResult !== 0}
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
