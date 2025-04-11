import { RTM_ERROR_CODE, useRtm } from 'agora-react-native-rtm';
import React, { useEffect, useState } from 'react';

import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { AgoraButton, AgoraStyle } from '../../components/ui';
import Config from '../../config/agora.config';

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
    let result = await client.login(Config.token);
    console.log('login', result);
    setLoginSuccess(result.errorCode === RTM_ERROR_CODE.RTM_ERROR_OK);
  };

  /**
   * Step 4 (Optional): logout
   */
  const logout = async () => {
    let result = await client.logout();
    console.log('logout', result);
    setLoginSuccess(false);
  };

  // useRtmEvent(client, 'onLoginResult', (errorCode: RTM_ERROR_CODE) => {
  //   console.log('onLoginResult', 'errorCode', errorCode);
  //   setLoginSuccess(errorCode === RTM_ERROR_CODE.RTM_ERROR_OK);
  // });

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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
