import {
  RTM_CONNECTION_CHANGE_REASON,
  RTM_CONNECTION_STATE,
  RTM_ERROR_CODE,
  RtmConfig,
  RtmEncryptionConfig,
  RtmProxyConfig,
} from 'agora-react-native-rtm';

import React, { useCallback, useEffect, useState } from 'react';

import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import {
  ChannelProfileType,
  SDKBuildInfo,
  createAgoraRtcEngine,
} from 'react-native-agora';

import {
  AgoraButton,
  AgoraStyle,
  AgoraText,
  AgoraTextInput,
} from '../../components/ui';
import Config from '../../config/agora.config';
import { useRtmClient } from '../../hooks/useRtmClient';
import * as log from '../../utils/log';

export default function UseRTC() {
  const [uid, setUid] = useState(Config.uid);
  const [rtcVersion, setRtcVersion] = useState<SDKBuildInfo>({
    version: '',
    build: 0,
  });
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [initResult, setInitResult] = useState<number>(0);
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
        eventHandler: {
          onLoginResult: () => {
            console.log('onLoginResult');
          },
        },
      })
    );
    setInitResult(result);
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

  useEffect(() => {
    let engine = createAgoraRtcEngine();
    console.log(engine.getVersion());
    // engine.initialize({
    //   appId: Config.appId,
    //   channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    // });
    // setRtcVersion(engine.getVersion());
    return () => {
      // engine.release();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={AgoraStyle.fullSize}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={AgoraStyle.fullSize}>
        <AgoraText>{`RTC version:${rtcVersion.version},build: ${rtcVersion.build}`}</AgoraText>
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
          disabled={!uid || initResult !== 0}
          title={`${loginSuccess ? 'logout' : 'login'}`}
          onPress={() => {
            loginSuccess ? logout() : login();
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
