import {
  JoinChannelOptions,
  LockEvent,
  MessageEvent,
  PresenceEvent,
  PresenceOptions,
  RTMStreamChannel,
  RTM_CHANNEL_TYPE,
  StateItem,
  StorageEvent,
  useRtm,
  useRtmEvent,
} from 'agora-react-native-rtm';
import React, { useCallback, useState } from 'react';

import { ScrollView } from 'react-native';

import BaseComponent from '../../components/BaseComponent';
import {
  AgoraButton,
  AgoraDivider,
  AgoraDropdown,
  AgoraStyle,
  AgoraSwitch,
  AgoraTextInput,
} from '../../components/ui';
import Config from '../../config/agora.config';
import { enumToItems } from '../../utils';
import * as log from '../../utils/log';

export default function Presence() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [streamChannel, setStreamChannel] = useState<RTMStreamChannel>();
  const [cName, setCName] = useState<string>(Config.channelName);
  const [channelType, setChannelType] = useState<number>(
    RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE
  );
  const [uid] = useState<string>(Config.uid);
  const [searchUid, setSearchUid] = useState<string>(Config.uid);
  const [stateKey, setStateKey] = useState<string>('test state');
  const [stateValue, setStateValue] = useState<string>('test state value');
  const [withMessage, setWithMessage] = useState<boolean>(true);
  const [withMetadata, setWithMetadata] = useState<boolean>(true);
  const [withPresence, setWithPresence] = useState<boolean>(true);
  const [withLock, setWithLock] = useState<boolean>(true);

  /**
   * Step 1: getRtmClient and initialize rtm client from BaseComponent
   */
  const client = useRtm();

  /**
   * createStreamChannel
   */
  const createStreamChannel = () => {
    if (joinSuccess) {
      log.error('already joined channel');
      return;
    }
    let result = client.createStreamChannel(cName);
    setStreamChannel(result);
    log.info('createStreamChannel success', result);
  };

  const join = async () => {
    try {
      if (!streamChannel) {
        log.error('please create streamChannel first');
        return;
      }
      let result = await streamChannel.join(
        new JoinChannelOptions({
          token: Config.appId,
          withPresence: withPresence,
          withLock: withLock,
          withMetadata: withMetadata,
        })
      );
      log.info('join success', result);
      setJoinSuccess(true);
    } catch (status: any) {
      log.error('join error', status);
    }
  };

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

  const destroyStreamChannel = useCallback(() => {
    streamChannel?.release();
    setStreamChannel(undefined);
    log.info('destroyStreamChannel success');
  }, [streamChannel]);

  /**
   * Step 1-1(optional) : subscribe message channel
   */
  const subscribe = async () => {
    try {
      let result = await client.subscribe(cName, {
        withMessage: withMessage,
        withMetadata: withMetadata,
        withPresence: withPresence,
        withLock: withLock,
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
        channelType,
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
        channelType,
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
        channelType,
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
      let result = await client.presence.getState(uid, cName, channelType);
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
      let result = await client.presence.removeState(cName, channelType, {
        states: [stateKey],
      });
      log.info('removeState success', result);
    } catch (status: any) {
      log.error('removeState error', status);
    }
  };

  const handleLoginStatus = useCallback((status: boolean) => {
    setLoginSuccess(status);
    if (!status) {
      setJoinSuccess(false);
      setSubscribeSuccess(false);
      setStreamChannel(undefined);
    }
  }, []);

  useRtmEvent(client, 'lock', (lock: LockEvent) => {
    log.info('lock', lock);
  });

  useRtmEvent(client, 'message', (message: MessageEvent) => {
    log.info('message', message);
  });

  useRtmEvent(client, 'presence', (presence: PresenceEvent) => {
    log.info('presence', presence);
  });

  useRtmEvent(client, 'storage', (storage: StorageEvent) => {
    log.info('storage', storage);
  });

  return (
    <>
      <ScrollView style={AgoraStyle.fullSize}>
        <BaseComponent
          onChannelNameChanged={(v) => setCName(v)}
          onLoginStatusChanged={handleLoginStatus}
        />
        {channelType === RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM && (
          <>
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
              onPress={async () => {
                joinSuccess ? await leave() : await join();
              }}
            />
          </>
        )}
        <AgoraDivider />
        <AgoraDropdown
          items={enumToItems(RTM_CHANNEL_TYPE)}
          onValueChange={(v) => {
            setChannelType(v);
          }}
          title="select channelType"
          value={channelType}
        />
        <AgoraDivider />
        <AgoraSwitch
          title="withMetadata"
          value={withMetadata}
          onValueChange={(v) => {
            setWithMetadata(v);
          }}
        />
        <AgoraSwitch
          title="withPresence"
          value={withPresence}
          onValueChange={(v) => {
            setWithPresence(v);
          }}
        />
        <AgoraSwitch
          title="withLock"
          value={withLock}
          onValueChange={(v) => {
            setWithLock(v);
          }}
        />
        {channelType === RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE && (
          <>
            <AgoraDivider />
            <AgoraSwitch
              title="withMessage"
              value={withMessage}
              onValueChange={(v) => {
                setWithMessage(v);
              }}
            />
            <AgoraButton
              disabled={!loginSuccess}
              title={`${subscribeSuccess ? 'unsubscribe' : 'subscribe'}`}
              onPress={async () => {
                subscribeSuccess ? await unsubscribe() : await subscribe();
              }}
            />
          </>
        )}
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
