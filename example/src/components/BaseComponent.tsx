import { useNavigation } from '@react-navigation/native';
import { useRtm } from 'agora-react-native-rtm';
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
