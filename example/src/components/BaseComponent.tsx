import { useNavigation } from '@react-navigation/native';
import {
  LockEvent,
  PresenceEvent,
  RTM_ERROR_CODE,
  RtmConfig,
  RtmEncryptionConfig,
  RtmProxyConfig,
  StorageEvent,
  useRtm,
} from 'agora-react-native-rtm';
import React, { useCallback, useEffect, useState } from 'react';

import Config from '../config/agora.config';
import * as log from '../utils/log';

import { LogSink } from './LogSink';
import { AgoraButton, AgoraStyle, AgoraTextInput, AgoraView } from './ui';

interface Props {
  onChannelNameChanged?: (value: string) => void;
}

const Header = () => {
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <>
      <AgoraButton title="Logs" onPress={toggleOverlay} />
      {visible && <LogSink onBackdropPress={toggleOverlay} />}
    </>
  );
};

export default function BaseComponent({ onChannelNameChanged }: Props) {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [initResult, setInitResult] = useState<number>(0);
  const [cName, setCName] = useState<string>(Config.channelName);
  const navigation = useNavigation();

  const onLoginResult = useCallback((errorCode: RTM_ERROR_CODE) => {
    log.log('onLoginResult', 'errorCode', errorCode);
    setLoginSuccess(errorCode === RTM_ERROR_CODE.RTM_ERROR_OK);
  }, []);

  const onStorageEvent = useCallback((event: StorageEvent) => {
    log.log('onStorageEvent', 'event', event);
  }, []);

  const onLockEvent = useCallback((event: LockEvent) => {
    log.log('onLockEvent', 'event', event);
  }, []);

  const onPresenceEvent = useCallback((event: PresenceEvent) => {
    log.log('onPresenceEvent', 'event', event);
  }, []);

  useEffect(() => {
    const headerRight = () => <Header />;
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
  const client = useRtm();

  // useEffect(() => {
  //   client.addEventListener('onLoginResult', onLoginResult);
  //   client.addEventListener('onLockEvent', onLockEvent);
  //   client.addEventListener('onStorageEvent', onStorageEvent);
  //   client.addEventListener('onPresenceEvent', onPresenceEvent);

  //   return () => {
  //     client.removeEventListener('onLoginResult', onLoginResult);
  //     client.removeEventListener('onLockEvent', onLockEvent);
  //     client.removeEventListener('onStorageEvent', onStorageEvent);
  //     client.removeEventListener('onPresenceEvent', onPresenceEvent);
  //   };
  // }, [
  //   client,
  //   uid,
  //   onLoginResult,
  //   onLockEvent,
  //   onStorageEvent,
  //   onPresenceEvent,
  // ]);

  /**
   * Step 3: login to rtm
   */
  const login = async () => {
    try {
      await client.login({ token: Config.token });
      setLoginSuccess(true);
    } catch (status: any) {
      log.error('login error', status);
    }
  };

  /**
   * Step 4 (Optional): logout
   */
  const logout = async () => {
    try {
      await client.logout();
      setLoginSuccess(false);
    } catch (status: any) {
      log.error('logout error', status);
    }
  };

  return (
    <AgoraView style={AgoraStyle.fullWidth}>
      <AgoraButton
        disabled={initResult !== 0}
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
