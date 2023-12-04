import { useNavigation } from '@react-navigation/native';
import {
  LockEvent,
  PresenceEvent,
  RTM_ERROR_CODE,
  RtmConfig,
  RtmEncryptionConfig,
  RtmProxyConfig,
  StorageEvent,
} from 'agora-react-native-rtm';
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
    client.addEventListener('onLockEvent', onLockEvent);
    client.addEventListener('onStorageEvent', onStorageEvent);
    client.addEventListener('onPresenceEvent', onPresenceEvent);

    return () => {
      client.removeEventListener('onLoginResult', onLoginResult);
      client.removeEventListener('onLockEvent', onLockEvent);
      client.removeEventListener('onStorageEvent', onStorageEvent);
      client.removeEventListener('onPresenceEvent', onPresenceEvent);
    };
  }, [
    client,
    uid,
    onLoginResult,
    onLockEvent,
    onStorageEvent,
    onPresenceEvent,
  ]);

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
