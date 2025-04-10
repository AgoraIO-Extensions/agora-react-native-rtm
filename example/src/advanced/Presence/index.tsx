import {
  ChannelInfo,
  PresenceOptions,
  RTM_CHANNEL_TYPE,
  RTM_CONNECTION_CHANGE_REASON,
  RTM_CONNECTION_STATE,
  RTM_ERROR_CODE,
  StateItem,
  UserState,
  useRtm,
} from 'agora-react-native-rtm';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { ScrollView } from 'react-native';

import BaseComponent from '../../components/BaseComponent';
import { AgoraButton, AgoraStyle, AgoraTextInput } from '../../components/ui';
import Config from '../../config/agora.config';
import * as log from '../../utils/log';

export default function Presence() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const whoNowRequestId = useRef<number>();
  const getOnlineRequestId = useRef<number>();
  const getUserChannelsRequestId = useRef<number>();
  const whereNowRequestId = useRef<number>();
  const setStateRequestId = useRef<number>();
  const getStateRequestId = useRef<number>();
  const removeStateRequestId = useRef<number>();
  const [cName, setCName] = useState<string>(Config.channelName);
  const [uid, setUid] = useState<string>(Config.uid);
  const [searchUid, setSearchUid] = useState<string>(Config.uid);
  const [stateKey, setStateKey] = useState<string>('test state');
  const [stateValue, setStateValue] = useState<string>('test state value');

  const onSubscribeResult = useCallback(
    (requestId: number, channelName: string, errorCode: RTM_ERROR_CODE) => {
      log.log(
        'onSubscribeResult',
        'requestId',
        requestId,
        'channelName',
        channelName,
        'errorCode',
        errorCode
      );
      setSubscribeSuccess(errorCode === RTM_ERROR_CODE.RTM_ERROR_OK);
    },
    []
  );

  const onWhoNowResult = useCallback(
    (
      requestId: number,
      userStateList: UserState[],
      count: number,
      nextPage: string,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.log(
        'onWhoNowResult',
        'requestId',
        requestId,
        'userStateList',
        userStateList,
        'count',
        count,
        'nextPage',
        nextPage,
        'errorCode',
        errorCode
      );
      if (
        requestId === whoNowRequestId.current &&
        errorCode === RTM_ERROR_CODE.RTM_ERROR_OK
      ) {
        log.alert(
          `channel: ${cName} status`,
          `${JSON.stringify(userStateList)}`
        );
      }
    },
    [cName]
  );

  const onGetOnlineUsersResult = useCallback(
    (
      requestId: number,
      userStateList: UserState[],
      count: number,
      nextPage: string,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.log(
        'onGetOnlineUsersResult',
        'requestId',
        requestId,
        'userStateList',
        userStateList,
        'count',
        count,
        'nextPage',
        nextPage,
        'errorCode',
        errorCode
      );
      if (
        requestId === getOnlineRequestId.current &&
        errorCode === RTM_ERROR_CODE.RTM_ERROR_OK
      ) {
        log.alert(
          `channel: ${cName} status`,
          `${JSON.stringify(userStateList)}`
        );
      }
    },
    [cName]
  );

  const onWhereNowResult = useCallback(
    (
      requestId: number,
      channels: ChannelInfo[],
      count: number,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.log(
        'onWhereNowResult',
        'requestId',
        requestId,
        'channels',
        channels,
        'count',
        count,
        'errorCode',
        errorCode
      );
      if (
        requestId === whereNowRequestId.current &&
        errorCode === RTM_ERROR_CODE.RTM_ERROR_OK
      ) {
        log.alert(`${searchUid} is at`, `${JSON.stringify(channels)}`);
      }
    },
    [searchUid]
  );

  const onGetUserChannelsResult = useCallback(
    (
      requestId: number,
      channels: ChannelInfo[],
      count: number,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.log(
        'onGetUserChannelsResult',
        'requestId',
        requestId,
        'channels',
        channels,
        'count',
        count,
        'errorCode',
        errorCode
      );
      if (
        requestId === getUserChannelsRequestId.current &&
        errorCode === RTM_ERROR_CODE.RTM_ERROR_OK
      ) {
        log.alert(`${searchUid} is at`, `${JSON.stringify(channels)}`);
      }
    },
    [searchUid]
  );

  const onPresenceSetStateResult = useCallback(
    (requestId: number, errorCode: RTM_ERROR_CODE) => {
      log.log(
        'onPresenceSetStateResult',
        'requestId',
        requestId,
        'errorCode',
        errorCode
      );
      if (
        requestId === setStateRequestId.current &&
        errorCode === RTM_ERROR_CODE.RTM_ERROR_OK
      ) {
        // log.alert(`${uid} state:`, `${JSON.stringify(state)}`);
        // setUserState(state);
      }
    },
    []
  );

  const onPresenceGetStateResult = useCallback(
    (requestId: number, state: UserState, errorCode: RTM_ERROR_CODE) => {
      log.log(
        'onPresenceGetStateResult',
        'requestId',
        requestId,
        'state',
        state,
        'errorCode',
        errorCode
      );
      if (
        requestId === getStateRequestId.current &&
        errorCode === RTM_ERROR_CODE.RTM_ERROR_OK
      ) {
        log.alert(`${uid} state:`, `${JSON.stringify(state)}`);
      }
    },
    [uid]
  );

  const onPresenceRemoveStateResult = useCallback(
    (requestId: number, errorCode: RTM_ERROR_CODE) => {
      log.log(
        'onPresenceRemoveStateResult',
        'requestId',
        requestId,
        'errorCode',
        errorCode
      );
    },
    []
  );

  /**
   * Step 1: getRtmClient and initialize rtm client from BaseComponent
   */
  const client = useRtm();

  /**
   * Step 1-1(optional) : subscribe message channel
   */
  const subscribe = () => {
    client.subscribe(cName, {
      withMessage: true,
      withMetadata: true,
      withPresence: true,
      withLock: true,
    });
  };

  /**
   * Step 1-1 : unsubscribe message channel
   */
  const unsubscribe = () => {
    client.unsubscribe(cName);
    setSubscribeSuccess(false);
  };

  /**
   * Step 2 : whoNow
   */
  const whoNow = () => {
    whoNowRequestId.current = client
      .getPresence()
      .whoNow(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
        new PresenceOptions({ includeState: true, includeUserId: true })
      );
  };

  /**
   * Step 2-1 : getOnlineUsers
   */
  const getOnlineUsers = () => {
    getOnlineRequestId.current = client
      .getPresence()
      .getOnlineUsers(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
        new PresenceOptions({ includeState: true, includeUserId: true })
      );
  };

  /**
   * Step 3 : whereNow
   */
  const whereNow = () => {
    whereNowRequestId.current = client.getPresence().whereNow(searchUid);
  };

  /**
   * Step 3-1 : getUserChannels
   */
  const getUserChannels = () => {
    getUserChannelsRequestId.current = client
      .getPresence()
      .getUserChannels(searchUid);
  };

  /**
   * Step 4 : setState
   */
  const setState = () => {
    setStateRequestId.current = client.getPresence().setState(
      cName,
      RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
      [
        new StateItem({ key: stateKey, value: stateValue }),
        // new StateItem({ key: 'location', value: location }),
      ],
      1
    );
  };

  /**
   * Step 5 : getState
   */
  const getState = () => {
    getStateRequestId.current = client
      .getPresence()
      .getState(cName, RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE, uid);
  };

  /**
   * Step 6 : removeState
   */
  const removeState = () => {
    removeStateRequestId.current = client
      .getPresence()
      .removeState(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
        [stateKey],
        1
      );
  };

  useEffect(() => {
    client.addEventListener('onSubscribeResult', onSubscribeResult);
    client.addEventListener('onWhoNowResult', onWhoNowResult);
    client.addEventListener('onGetOnlineUsersResult', onGetOnlineUsersResult);
    client.addEventListener('onGetUserChannelsResult', onGetUserChannelsResult);
    client.addEventListener('onWhereNowResult', onWhereNowResult);
    client.addEventListener(
      'onPresenceSetStateResult',
      onPresenceSetStateResult
    );
    client.addEventListener(
      'onPresenceGetStateResult',
      onPresenceGetStateResult
    );
    client.addEventListener(
      'onPresenceRemoveStateResult',
      onPresenceRemoveStateResult
    );

    return () => {
      client.removeEventListener('onSubscribeResult', onSubscribeResult);
      client.removeEventListener('onWhoNowResult', onWhoNowResult);
      client.removeEventListener(
        'onGetOnlineUsersResult',
        onGetOnlineUsersResult
      );
      client.removeEventListener(
        'onGetUserChannelsResult',
        onGetUserChannelsResult
      );
      client.removeEventListener('onWhereNowResult', onWhereNowResult);
      client.removeEventListener(
        'onPresenceSetStateResult',
        onPresenceSetStateResult
      );
      client.removeEventListener(
        'onPresenceGetStateResult',
        onPresenceGetStateResult
      );
      client.removeEventListener(
        'onPresenceRemoveStateResult',
        onPresenceRemoveStateResult
      );
    };
  }, [
    client,
    uid,
    onSubscribeResult,
    onWhoNowResult,
    onGetOnlineUsersResult,
    onWhereNowResult,
    onGetUserChannelsResult,
    onPresenceSetStateResult,
    onPresenceGetStateResult,
    onPresenceRemoveStateResult,
  ]);

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
          }
          setSubscribeSuccess(false);
          break;
      }
    },
    []
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
    <>
      <ScrollView style={AgoraStyle.fullSize}>
        <BaseComponent
          onChannelNameChanged={(v) => setCName(v)}
          onUidChanged={(v) => setUid(v)}
        />
        <AgoraButton
          disabled={!loginSuccess}
          title={`${subscribeSuccess ? 'unsubscribe' : 'subscribe'}`}
          onPress={() => {
            subscribeSuccess ? unsubscribe() : subscribe();
          }}
        />
        <AgoraButton
          title={`whoNow`}
          onPress={() => {
            whoNow();
          }}
        />
        <AgoraButton
          title={`getOnlineUsers`}
          onPress={() => {
            getOnlineUsers();
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
          onPress={() => {
            whereNow();
          }}
        />
        <AgoraButton
          title={`getUserChannels`}
          onPress={() => {
            getUserChannels();
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
          onPress={() => {
            setState();
          }}
        />
        <AgoraButton
          title={`getState`}
          onPress={() => {
            getState();
          }}
        />
        <AgoraButton
          title={`removeState`}
          onPress={() => {
            removeState();
          }}
        />
      </ScrollView>
    </>
  );
}
