import {
  PresenceOptions,
  RTM_CHANNEL_TYPE,
  StateItem,
  useRtm,
} from 'agora-react-native-rtm';
import React, { useCallback, useState } from 'react';

import { ScrollView } from 'react-native';

import BaseComponent from '../../components/BaseComponent';
import { AgoraButton, AgoraStyle, AgoraTextInput } from '../../components/ui';
import Config from '../../config/agora.config';
import * as log from '../../utils/log';

export default function Presence() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [cName, setCName] = useState<string>(Config.channelName);
  const [uid] = useState<string>(Config.uid);
  const [searchUid, setSearchUid] = useState<string>(Config.uid);
  const [stateKey, setStateKey] = useState<string>('test state');
  const [stateValue, setStateValue] = useState<string>('test state value');

  /**
   * Step 1: getRtmClient and initialize rtm client from BaseComponent
   */
  const client = useRtm();

  /**
   * Step 1-1(optional) : subscribe message channel
   */
  const subscribe = async () => {
    try {
      let result = await client.subscribe(cName, {
        withMessage: true,
        withMetadata: true,
        withPresence: true,
        withLock: true,
      });
      setSubscribeSuccess(true);
      log.info('subscribe success', result);
    } catch (status: any) {
      log.error('subscribe error', status);
    }
  };

  /**
   * Step 1-1 : unsubscribe message channel
   */
  const unsubscribe = async () => {
    try {
      let result = await client.unsubscribe(cName);
      setSubscribeSuccess(false);
      log.info('unsubscribe success', result);
    } catch (status: any) {
      log.error('unsubscribe error', status);
    }
  };

  /**
   * Step 2 : whoNow
   */
  const whoNow = async () => {
    try {
      let result = await client.presence.whoNow(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
        new PresenceOptions({ includeState: true, includeUserId: true })
      );
      log.info('whoNow success', result);
    } catch (status: any) {
      log.error('whoNow error', status);
    }
  };

  /**
   * Step 2-1 : getOnlineUsers
   */
  const getOnlineUsers = async () => {
    try {
      let result = await client.presence.getOnlineUsers(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
        new PresenceOptions({ includeState: true, includeUserId: true })
      );
      log.info('getOnlineUsers success', result);
    } catch (status: any) {
      log.error('getOnlineUsers error', status);
    }
  };

  /**
   * Step 3 : whereNow
   */
  const whereNow = async () => {
    try {
      let result = await client.presence.whereNow(searchUid);
      log.info('whereNow success', result);
    } catch (status: any) {
      log.error('whereNow error', status);
    }
  };

  /**
   * Step 3-1 : getUserChannels
   */
  const getUserChannels = async () => {
    try {
      let result = await client.presence.getUserChannels(searchUid);
      log.info('getUserChannels success', result);
    } catch (status: any) {
      log.error('getUserChannels error', status);
    }
  };

  /**
   * Step 4 : setState
   */
  const setState = async () => {
    try {
      let result = await client.presence.setState(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
        new StateItem({ key: stateKey, value: stateValue })
      );
      log.info('setState success', result);
    } catch (status: any) {
      log.error('setState error', status);
    }
  };

  /**
   * Step 5 : getState
   */
  const getState = async () => {
    try {
      let result = await client.presence.getState(
        uid,
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE
      );
      log.info('getState success', result);
    } catch (status: any) {
      log.error('getState error', status);
    }
  };

  /**
   * Step 6 : removeState
   */
  const removeState = async () => {
    try {
      let result = await client.presence.removeState(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
        { states: [stateKey] }
      );
      log.info('removeState success', result);
    } catch (status: any) {
      log.error('removeState error', status);
    }
  };

  const handleLoginStatus = useCallback((status: boolean) => {
    setLoginSuccess(status);
    if (!status) {
      setSubscribeSuccess(false);
    }
  }, []);

  return (
    <>
      <ScrollView style={AgoraStyle.fullSize}>
        <BaseComponent
          onChannelNameChanged={(v) => setCName(v)}
          onLoginStatusChanged={handleLoginStatus}
        />
        <AgoraButton
          disabled={!loginSuccess}
          title={`${subscribeSuccess ? 'unsubscribe' : 'subscribe'}`}
          onPress={async () => {
            subscribeSuccess ? await unsubscribe() : await subscribe();
          }}
        />
        <AgoraButton
          title={`whoNow`}
          onPress={async () => {
            await whoNow();
          }}
        />
        <AgoraButton
          title={`getOnlineUsers`}
          onPress={async () => {
            await getOnlineUsers();
          }}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            setSearchUid(text);
          }}
          label="what uid you want to find"
          value={searchUid}
        />
        <AgoraButton
          title={`whereNow`}
          onPress={async () => {
            await whereNow();
          }}
        />
        <AgoraButton
          title={`getUserChannels`}
          onPress={async () => {
            await getUserChannels();
          }}
        />

        <AgoraTextInput
          label="input state key"
          value={stateKey}
          onChangeText={(text) => {
            setStateKey(text);
          }}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            setStateValue(text);
          }}
          label="input state value"
          value={stateValue}
        />
        <AgoraButton
          title={`setState`}
          onPress={async () => {
            await setState();
          }}
        />
        <AgoraButton
          title={`getState`}
          onPress={async () => {
            await getState();
          }}
        />
        <AgoraButton
          title={`removeState`}
          onPress={async () => {
            await removeState();
          }}
        />
      </ScrollView>
    </>
  );
}
