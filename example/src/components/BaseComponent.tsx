import { useNavigation } from '@react-navigation/native';
import {
  LinkStateEvent,
  LockEvent,
  PresenceEvent,
  RTM_ERROR_CODE,
  RTM_LINK_STATE,
  RTM_LINK_STATE_CHANGE_REASON,
  RtmConfig,
  RtmEncryptionConfig,
  RtmProxyConfig,
  StorageEvent,
  useRtm,
  useRtmEvent,
} from 'agora-react-native-rtm';
import React, { useCallback, useEffect, useState } from 'react';

import Config from '../config/agora.config';
import * as log from '../utils/log';

import { LogSink } from './LogSink';
import { AgoraButton, AgoraStyle, AgoraTextInput, AgoraView } from './ui';

interface Props {
  onChannelNameChanged?: (value: string) => void;
  onLoginStatusChanged?: (isLoggedIn: boolean) => void;
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
  onChannelNameChanged,
  onLoginStatusChanged,
}: Props) {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [cName, setCName] = useState<string>(Config.channelName);
  const navigation = useNavigation();

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

  /**
   * Step 3: login to rtm
   */
  const login = async () => {
    try {
      await client.login({ token: Config.token });
      setLoginSuccess(true);
      onLoginStatusChanged?.(true);
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
      onLoginStatusChanged?.(false);
    } catch (status: any) {
      log.error('logout error', status);
    }
  };

  return (
    <AgoraView style={AgoraStyle.fullWidth}>
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
