import {
  IStreamChannel,
  JoinChannelOptions,
  RTM_CONNECTION_CHANGE_REASON,
  RTM_CONNECTION_STATE,
  RTM_ERROR_CODE,
  useRtm,
} from 'agora-react-native-rtm';
import React, { useCallback, useEffect, useState } from 'react';

import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import BaseComponent from '../../components/BaseComponent';
import { AgoraButton, AgoraStyle } from '../../components/ui';
import Config from '../../config/agora.config';
import * as log from '../../utils/log';

export default function CreateStreamChannel() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [streamChannel, setStreamChannel] = useState<IStreamChannel>();
  const [cName, setCName] = useState<string>(Config.channelName);
  const [uid, setUid] = useState<string>(Config.uid);

  const onJoinResult = useCallback(
    (
      requestId: number,
      channelName: string,
      userId: string,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.info(
        'onJoinResult',
        'requestId',
        requestId,
        'channelName',
        channelName,
        'userId',
        userId,
        'errorCode',
        errorCode
      );
      setJoinSuccess(errorCode === RTM_ERROR_CODE.RTM_ERROR_OK);
    },
    []
  );

  const onLeaveResult = useCallback(
    (
      requestId: number,
      channelName: string,
      userId: string,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.info(
        'onLeaveResult',
        'requestId',
        requestId,
        'channelName',
        channelName,
        'userId',
        userId,
        'errorCode',
        errorCode
      );
      setJoinSuccess(errorCode !== RTM_ERROR_CODE.RTM_ERROR_OK);
    },
    []
  );

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
  const join = () => {
    if (!streamChannel) {
      log.error('please create streamChannel first');
      return;
    }
    streamChannel.join(
      new JoinChannelOptions({
        token: Config.appId,
      })
    );
  };

  /**
   * Step 4 : leave
   */
  const leave = () => {
    if (streamChannel) {
      streamChannel.leave(0);
    }
  };

  /**
   * Step 5 : destroyStreamChannel
   */
  const destroyStreamChannel = useCallback(() => {
    streamChannel?.release();
    setStreamChannel(undefined);
  }, [streamChannel]);

  useEffect(() => {
    client.addEventListener('onJoinResult', onJoinResult);
    client.addEventListener('onLeaveResult', onLeaveResult);

    return () => {
      client.removeEventListener('onJoinResult', onJoinResult);
      client.removeEventListener('onLeaveResult', onLeaveResult);
    };
  }, [client, uid, onJoinResult, onLeaveResult]);

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
      switch (state) {
        case RTM_CONNECTION_STATE.RTM_CONNECTION_STATE_CONNECTED:
          setLoginSuccess(true);
          break;
        case RTM_CONNECTION_STATE.RTM_CONNECTION_STATE_DISCONNECTED:
          if (
            reason ===
            RTM_CONNECTION_CHANGE_REASON.RTM_CONNECTION_CHANGED_LOGOUT
          ) {
            setLoginSuccess(false);
            destroyStreamChannel();
          }
          setJoinSuccess(false);
          break;
      }
    },
    [destroyStreamChannel]
  );
  useEffect(() => {
    client?.addEventListener(
      'onConnectionStateChanged',
      onConnectionStateChanged
    );
    return () => {
      client?.removeEventListener(
        'onConnectionStateChanged',
        onConnectionStateChanged
      );
    };
  }, [client, uid, onConnectionStateChanged]);

  return (
    <KeyboardAvoidingView
      style={AgoraStyle.fullSize}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={AgoraStyle.fullSize}>
        <BaseComponent
          onChannelNameChanged={(v) => setCName(v)}
          onUidChanged={(v) => setUid(v)}
        />
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
          disabled={!streamChannel}
          title={`getChannelName`}
          onPress={() => {
            if (streamChannel) {
              log.alert(streamChannel.getChannelName());
            }
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
