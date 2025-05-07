import { useNavigation } from '@react-navigation/native';
import {
  LinkStateEvent,
  LockEvent,
  MessageEvent,
  PresenceEvent,
  StorageEvent,
  useRtm,
  useRtmEvent,
} from 'agora-react-native-rtm';
import React, { useEffect, useState } from 'react';

import Config from '../config/agora.config';
import * as log from '../utils/log';

import { LogSink } from './LogSink';
import {
  AgoraButton,
  AgoraStyle,
  AgoraText,
  AgoraTextInput,
  AgoraView,
} from './ui';

interface Props {
  onChannelNameChanged?: (value: string) => void;
  onLoginStatusChanged?: (isLoggedIn: boolean) => void;
  onLinkState?: (linkState: LinkStateEvent) => void;
  onTokenPrivilegeWillExpire?: () => void;
  onLock?: (lock: LockEvent) => void;
  onMessage?: (message: MessageEvent) => void;
  onPresence?: (presence: PresenceEvent) => void;
  onStorage?: (storage: StorageEvent) => void;
}

export const Header = () => {
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <>
      <AgoraText onPress={toggleOverlay}>Logs</AgoraText>
      {visible && <LogSink onBackdropPress={toggleOverlay} />}
    </>
  );
};

export default function BaseComponent({
  onChannelNameChanged,
  onLoginStatusChanged,
  onLinkState,
  onTokenPrivilegeWillExpire,
  onLock,
  onMessage,
  onPresence,
  onStorage,
}: Props) {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [cName, setCName] = useState<string>(Config.channelName);
  const navigation = useNavigation();

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

  useRtmEvent(client, 'linkState', (linkState: LinkStateEvent) => {
    if (onLinkState) {
      onLinkState(linkState);
    } else {
      log.info('linkState', linkState);
    }
  });

  useRtmEvent(client, 'tokenPrivilegeWillExpire', () => {
    if (onTokenPrivilegeWillExpire) {
      onTokenPrivilegeWillExpire();
    } else {
      log.info('tokenPrivilegeWillExpire');
    }
  });

  useRtmEvent(client, 'lock', (lock: LockEvent) => {
    if (onLock) {
      onLock(lock);
    } else {
      log.info('lock', lock);
    }
  });

  useRtmEvent(client, 'message', (message: MessageEvent) => {
    if (onMessage) {
      onMessage(message);
    } else {
      log.info('message', message);
    }
  });

  useRtmEvent(client, 'presence', (presence: PresenceEvent) => {
    if (onPresence) {
      onPresence(presence);
    } else {
      log.info('presence', presence);
    }
  });

  useRtmEvent(client, 'storage', (storage: StorageEvent) => {
    if (onStorage) {
      onStorage(storage);
    } else {
      log.info('storage', storage);
    }
  });

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
