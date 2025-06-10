import { useNavigation } from '@react-navigation/native';
import { useRtm } from 'agora-react-native-rtm';
import React, { useEffect, useState } from 'react';

import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { Header } from '../../components/BaseComponent';
import { AgoraButton, AgoraStyle } from '../../components/ui';
import Config from '../../config/agora.config';
import * as log from '../../utils/log';

export default function Login() {
  const [loginSuccess, setLoginSuccess] = useState(false);

  /**
   * Step 1: getRtmClient
   */
  const client = useRtm();

  /**
   * Step 2: initialize rtm client
   */
  useEffect(() => {
    return () => {
      setLoginSuccess(false);
    };
  }, [client]);

  /**
   * Step 3: login to rtm
   */
  const login = async () => {
    try {
      let result = await client.login({ token: Config.token });
      setLoginSuccess(true);
      log.info('login success', result);
    } catch (status: any) {
      log.error('login error', status);
    }
  };

  /**
   * Step 4 (Optional): logout
   */
  const logout = async () => {
    try {
      let result = await client.logout();
      setLoginSuccess(false);
      log.info('logout success', result);
    } catch (status: any) {
      log.error('logout error', status);
    }
  };

  /**
   * Step 5: renew token
   */
  const renewToken = async () => {
    try {
      let result = await client.renewToken(Config.token);
      log.info('renewToken success', result);
    } catch (status: any) {
      log.error('renewToken error', status);
    }
  };

  const navigation = useNavigation();

  useEffect(() => {
    const headerRight = () => <Header />;
    navigation.setOptions({ headerRight });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={AgoraStyle.fullSize}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={AgoraStyle.fullSize}>
        <AgoraButton
          disabled={!Config.uid}
          title={`${loginSuccess ? 'logout' : 'login'}`}
          onPress={async () => {
            loginSuccess ? await logout() : await login();
          }}
        />
        <AgoraButton title="renewToken" onPress={renewToken} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
