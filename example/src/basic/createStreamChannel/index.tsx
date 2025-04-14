import type { LinkStateEvent, RTMStreamChannel } from 'agora-react-native-rtm';
import {
  JoinChannelOptions,
  RTM_LINK_STATE,
  RTM_LINK_STATE_CHANGE_REASON,
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
  const createStreamChannel = () => {
    if (joinSuccess) {
      log.error('already joined channel');
      return;
    }
    let result = client.createStreamChannel(cName);
    setStreamChannel(result);
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
      await streamChannel.join(
        new JoinChannelOptions({
          token: Config.appId,
        })
      );
      setJoinSuccess(true);
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
      await streamChannel.leave();
      setJoinSuccess(false);
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
  }, [streamChannel]);

  /**
   * Step 6: renew token
   */
  const renewToken = async () => {
    try {
      await client.renewToken(Config.token, {
        channelName: cName,
      });
    } catch (status: any) {
      log.error('renewToken error', status);
    }
  };

  useRtmEvent(client, 'linkState', (linkState: LinkStateEvent) => {
    log.info('linkState', linkState);
    switch (linkState.currentState) {
      case RTM_LINK_STATE.RTM_LINK_STATE_CONNECTED:
        setLoginSuccess(true);
        break;
      case RTM_LINK_STATE.RTM_LINK_STATE_DISCONNECTED:
        if (
          linkState.reasonCode ===
          RTM_LINK_STATE_CHANGE_REASON.RTM_LINK_STATE_CHANGE_REASON_LOGOUT
        ) {
          setLoginSuccess(false);
          destroyStreamChannel();
        }
        setJoinSuccess(false);
        break;
    }
  });

  useRtmEvent(client, 'tokenPrivilegeWillExpire', () => {
    log.info('tokenPrivilegeWillExpire');
  });

  return (
    <KeyboardAvoidingView
      style={AgoraStyle.fullSize}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={AgoraStyle.fullSize}>
        <BaseComponent onChannelNameChanged={(v) => setCName(v)} />
        <AgoraButton
          disabled={!loginSuccess}
          title={`${
            streamChannel ? 'destroyStreamChannel' : 'createStreamChannel'
          }`}
          onPress={() => {
            streamChannel ? destroyStreamChannel() : createStreamChannel();
          }}
        />
        <AgoraButton
          disabled={!loginSuccess || !streamChannel}
          title={`${joinSuccess ? 'leaveChannel' : 'joinChannel'}`}
          onPress={() => {
            joinSuccess ? leave() : join();
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
