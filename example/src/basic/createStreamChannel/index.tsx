import type { RTMStreamChannel } from 'agora-react-native-rtm';
import {
  JoinChannelOptions,
  useRtm,
  useRtmEvent,
} from 'agora-react-native-rtm';
import React, { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import BaseComponent from '../../components/BaseComponent';
import { AgoraButton, AgoraStyle } from '../../components/ui';
import Config from '../../config/agora.config';
import * as log from '../../utils/log';

export default function CreateStreamChannel() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [streamChannel, setStreamChannel] = useState<RTMStreamChannel>();
  const [cName, setCName] = useState<string>(Config.channelName);

  /**
   * Step 1: getRtmClient and initialize rtm client from BaseComponent
   */
  const client = useRtm();

  /**
   * Step 2 : createStreamChannel
   */
  const createStreamChannel = async () => {
    if (joinSuccess) {
      log.error('already joined channel');
      return;
    }
    try {
      let result = await client.createStreamChannel(cName);
      setStreamChannel(result);
      log.info('createStreamChannel success', result);
    } catch (status: any) {
      log.error('createStreamChannel error', status);
    }
  };

  /**
   * Step 3 : join
   */
  const join = async () => {
    try {
      if (!streamChannel) {
        log.error('please create streamChannel first');
        return;
      }
      let result = await streamChannel.join(
        new JoinChannelOptions({
          token: Config.appId,
        })
      );
      setJoinSuccess(true);
      log.info('join success', result);
    } catch (status: any) {
      log.error('join error', status);
    }
  };

  /**
   * Step 4 : leave
   */
  const leave = async () => {
    try {
      if (!streamChannel) {
        log.error('please create streamChannel first');
        return;
      }
      let result = await streamChannel.leave();
      setJoinSuccess(false);
      log.info('leave success', result);
    } catch (status: any) {
      log.error('leave error', status);
    }
  };

  /**
   * Step 5 : destroyStreamChannel
   */
  const destroyStreamChannel = useCallback(() => {
    streamChannel?.release();
    setStreamChannel(undefined);
    log.info('destroyStreamChannel success');
  }, [streamChannel]);

  /**
   * Step 6: renew token
   */
  const renewToken = async () => {
    try {
      let result = await client.renewToken(Config.token, {
        channelName: cName,
      });
      log.info('renewToken success', result);
    } catch (status: any) {
      log.error('renewToken error', status);
    }
  };

  useRtmEvent(client, 'tokenPrivilegeWillExpire', () => {
    log.info('tokenPrivilegeWillExpire');
  });

  const handleLoginStatus = useCallback((status: boolean) => {
    setLoginSuccess(status);
    if (!status) {
      setStreamChannel(undefined);
      setJoinSuccess(false);
    }
  }, []);

  return (
    <KeyboardAvoidingView
      style={AgoraStyle.fullSize}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={AgoraStyle.fullSize}>
        <BaseComponent
          onChannelNameChanged={(v) => setCName(v)}
          onLoginStatusChanged={handleLoginStatus}
        />
        <AgoraButton
          disabled={!loginSuccess}
          title={`${
            streamChannel ? 'destroyStreamChannel' : 'createStreamChannel'
          }`}
          onPress={async () => {
            streamChannel
              ? destroyStreamChannel()
              : await createStreamChannel();
          }}
        />
        <AgoraButton
          disabled={!loginSuccess || !streamChannel}
          title={`${joinSuccess ? 'leaveChannel' : 'joinChannel'}`}
          onPress={async () => {
            joinSuccess ? await leave() : await join();
          }}
        />
        <AgoraButton
          disabled={!loginSuccess || !streamChannel}
          title="renewToken"
          onPress={renewToken}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
