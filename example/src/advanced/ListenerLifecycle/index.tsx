import { MessageEvent, useRtm } from 'agora-react-native-rtm';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

import {
  DeviceEventEmitter,
  EVENT_PROCESSORS,
} from '../../../../src/internal/IrisRtmEngine';

import { AgoraButton, AgoraText } from '../../components/ui';
import Config from '../../config/agora.config';
import * as log from '../../utils/log';

export default function ListenerLifecycle() {
  const client = useRtm();
  const [callbacks, setCallbacks] = useState(0);
  const [registered, setRegistered] = useState(false);
  const [ready, setReady] = useState(false);
  const handler = useCallback((message: MessageEvent) => {
    setCallbacks((count) => count + 1);
    log.info('message callback', message);
  }, []);

  useEffect(() => {
    return () => client.removeEventListener('message', handler);
  }, [client, handler]);

  const connect = async () => {
    try {
      await client.login({ token: Config.token });
      await client.subscribe(Config.channelName);
      setReady(true);
    } catch (error) {
      log.error('login/subscribe failed', error);
    }
  };

  return (
    <ScrollView>
      <AgoraText>
        Reuse this Client: register, remove, then register again. Send one
        message from another user to the configured channel. Expect one callback
        while registered and zero after removal. Repeat with each removal
        button; the callback count is cumulative.
      </AgoraText>
      <AgoraText>Channel: {Config.channelName}</AgoraText>
      <AgoraText>Callbacks: {callbacks}</AgoraText>
      <AgoraText>Listener: {registered ? 'registered' : 'removed'}</AgoraText>
      <AgoraButton
        title="Simulate one incoming message (local only)"
        onPress={() => {
          DeviceEventEmitter.emit(
            'onMessageEvent',
            EVENT_PROCESSORS.RTMClientEventMap,
            {
              event: {
                message: 'Listener lifecycle test',
                publisher: 'local-test',
              },
            }
          );
        }}
      />
      <AgoraButton
        title="Login and subscribe"
        disabled={ready}
        onPress={connect}
      />
      <AgoraButton
        title="Register message listener"
        disabled={registered}
        onPress={() => {
          client.addEventListener('message', handler);
          setRegistered(true);
        }}
      />
      <AgoraButton
        title="Remove message listener"
        onPress={() => {
          client.removeEventListener('message', handler);
          setRegistered(false);
        }}
      />
      <AgoraButton
        title="Remove all message listeners"
        onPress={() => {
          client.removeAllListeners('message');
          setRegistered(false);
        }}
      />
      <AgoraButton
        title="Remove all listeners"
        onPress={() => {
          client.removeAllListeners();
          setRegistered(false);
        }}
      />
    </ScrollView>
  );
}
