import { useRtm } from 'agora-react-native-rtm';
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

  // useRtmEvent(client, 'onLoginResult', (errorCode: RTM_ERROR_CODE) => {
  //   log.log('onLoginResult', 'errorCode', errorCode);
  //   setLoginSuccess(errorCode === RTM_ERROR_CODE.RTM_ERROR_OK);
  // });
  // useRtmEvent(
  //   client,
  //   'onConnectionStateChanged',
  //   (
  //     channelName: string,
  //     state: RTM_CONNECTION_STATE,
  //     reason: RTM_CONNECTION_CHANGE_REASON
  //   ) => {
  //     log.log(
  //       'onConnectionStateChanged',
  //       'channelName',
  //       channelName,
  //       'state',
  //       state,
  //       'reason',
  //       reason
  //     );
  //   }
  // );

  return (
    <KeyboardAvoidingView
      style={AgoraStyle.fullSize}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={AgoraStyle.fullSize}>
        <AgoraButton
          disabled={!Config.uid}
          title={`${loginSuccess ? 'logout' : 'login'}`}
          onPress={() => {
            loginSuccess ? logout() : login();
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
