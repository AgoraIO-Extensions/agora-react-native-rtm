import {
  RTM_CONNECTION_CHANGE_REASON,
  RTM_CONNECTION_STATE,
  RTM_ERROR_CODE,
  RtmConfig,
} from 'agora-react-native-rtm';
import React, { useCallback, useEffect, useState } from 'react';

import { KeyboardAvoidingView, Platform } from 'react-native';

import {
  AgoraButton,
  AgoraStyle,
  AgoraText,
  AgoraTextInput,
  AgoraView,
} from '../../components/ui';
import Config from '../../config/agora.config';
import { useRtmClient } from '../../hooks/useRtmClient';
import * as log from '../../utils/log';
log.alert(JSON.stringify(Config));

export default function Login() {
  const [uid, setUid] = useState(Config.uid);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const onLoginResult = useCallback((errorCode: RTM_ERROR_CODE) => {
    log.log('onLoginResult', 'errorCode', errorCode);
    setLoginSuccess(errorCode === RTM_ERROR_CODE.RTM_ERROR_OK);
  }, []);

  const onConnectionStateChanged = useCallback(
    (
      channelName: string,
      state: RTM_CONNECTION_STATE,
      reason: RTM_CONNECTION_CHANGE_REASON
    ) => {
      log.log(
        'onConnectionStateChanged',
        'channelName',
        channelName,
        'state',
        state,
        'reason',
        reason
      );
    },
    []
  );

  /**
   * Step 1: getRtmClient
   */
  const client = useRtmClient();

  /**
   * Step 2: initialize rtm client
   */
  useEffect(() => {
    if (!uid || uid.length === 0) {
      return;
    }
    client.initialize(
      new RtmConfig({
        userId: uid,
        appId: Config.appId,
        eventHandler: {
          onLoginResult: () => {
            console.log('onLoginResult');
          },
        },
      })
    );
    return () => {
      setLoginSuccess(false);
      client.release();
    };
  }, [client, uid]);

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

  useEffect(() => {
    client?.addEventListener('onLoginResult', onLoginResult);
    client?.addEventListener(
      'onConnectionStateChanged',
      onConnectionStateChanged
    );
    return () => {
      client?.removeEventListener('onLoginResult', onLoginResult);
      client?.removeEventListener(
        'onConnectionStateChanged',
        onConnectionStateChanged
      );
    };
  }, [client, uid, onLoginResult, onConnectionStateChanged]);

  return (
    <KeyboardAvoidingView
      style={AgoraStyle.fullSize}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AgoraView style={AgoraStyle.fullWidth}>
        {loginSuccess ? (
          <AgoraText>{`current login userId:\n${uid}`}</AgoraText>
        ) : (
          <AgoraTextInput
            onChangeText={(text) => {
              setUid(text);
            }}
            placeholder="please input userId"
            label="userId"
            value={uid}
          />
        )}
        <AgoraButton
          title={`${loginSuccess ? 'logout' : 'login'}`}
          onPress={() => {
            loginSuccess ? logout() : login();
          }}
        />
      </AgoraView>
    </KeyboardAvoidingView>
  );
}
