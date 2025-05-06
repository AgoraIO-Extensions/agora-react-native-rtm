import { useNavigation } from '@react-navigation/native';
import { useRtm } from 'agora-react-native-rtm';

import React, { useEffect, useState } from 'react';

import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import {
  ChannelProfileType,
  SDKBuildInfo,
  createAgoraRtcEngine,
} from 'react-native-agora';

import { Header } from '../../components/BaseComponent';

import { AgoraButton, AgoraStyle, AgoraText } from '../../components/ui';
import Config from '../../config/agora.config';
import * as log from '../../utils/log';

export default function UseRTC() {
  const [rtcVersion, setRtcVersion] = useState<SDKBuildInfo>({
    version: '',
    build: 0,
  });
  const [loginSuccess, setLoginSuccess] = useState(false);

  /**
   * Step 1: getRtmClient
   */
  const client = useRtm();

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

  useEffect(() => {
    let engine = createAgoraRtcEngine();
    console.log(engine.getVersion());
    engine.initialize({
      appId: Config.appId,
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });
    setRtcVersion(engine.getVersion());
    return () => {
      engine.release();
    };
  }, []);

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
        <AgoraText>{`RTC version:${rtcVersion.version},build: ${rtcVersion.build}`}</AgoraText>
        <AgoraButton
          title={`${loginSuccess ? 'logout' : 'login'}`}
          onPress={() => {
            loginSuccess ? logout() : login();
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
