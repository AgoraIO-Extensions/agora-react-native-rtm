import {
  ChannelInfo,
  IStreamChannel,
  JoinChannelOptions,
  PresenceEvent,
  PresenceOptions,
  RTM_CHANNEL_TYPE,
  RTM_CONNECTION_CHANGE_REASON,
  RTM_CONNECTION_STATE,
  RTM_ERROR_CODE,
  StateItem,
  UserState,
} from 'agora-react-native-rtm';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { ScrollView } from 'react-native';

import { IMetadata } from '../../../../src/IAgoraRtmStorage';
import BaseComponent from '../../components/BaseComponent';
import {
  AgoraButton,
  AgoraDropdown,
  AgoraStyle,
  AgoraTextInput,
} from '../../components/ui';
import Config from '../../config/agora.config';
import { useRtmClient } from '../../hooks/useRtmClient';
import { arrayToItems } from '../../utils';
import * as log from '../../utils/log';

export default function ChannelMetadata() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [streamChannel, setStreamChannel] = useState<IStreamChannel>();
  const [cName, setCName] = useState<string>(Config.channelName);
  const getChannelMetadataRequestId = useRef<number>();
  const setChannelMetadataRequestId = useRef<number>();
  const setStateRequestId = useRef<number>();
  const getStateRequestId = useRef<number>();
  const removeStateRequestId = useRef<number>();
  const [uid, setUid] = useState<string>(Config.uid);
  const [searchUid, setSearchUid] = useState<string>(Config.uid);
  const [feeling, setFeeling] = useState<string>('happy');
  const [location, setLocation] = useState<string>('tokyo');

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

  const onGetChannelMetadataResult = useCallback(
    (
      requestId: number,
      channelName: string,
      channelType: RTM_CHANNEL_TYPE,
      data: IMetadata,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.info(
        'onGetChannelMetadataResult',
        'requestId',
        requestId,
        'channelName',
        channelName,
        'channelType',
        channelType,
        'data',
        data,
        'errorCode',
        errorCode
      );
      if (
        requestId === getChannelMetadataRequestId.current &&
        errorCode === RTM_ERROR_CODE.RTM_ERROR_OK
      ) {
        log.alert(`${channelName} metadata:`, `${JSON.stringify(data)}`);
      }
    },
    []
  );

  /**
   * Step 1: getRtmClient and initialize rtm client from BaseComponent
   */
  const client = useRtmClient();

  /**
   * Step 1-1 : createStreamChannel
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
   * Step 1-2 : join message channel
   */
  const join = () => {
    if (!streamChannel) {
      log.error('please create streamChannel first');
      return;
    }
    streamChannel.join(new JoinChannelOptions({ token: Config.appId }));
  };

  /**
   * Step 1-3 : leave message channel
   */
  const leave = () => {
    if (streamChannel) {
      streamChannel.leave(0);
    }
  };

  /**
   * Step 1-4 : destroyStreamChannel
   */
  const destroyStreamChannel = useCallback(() => {
    streamChannel?.release();
    setStreamChannel(undefined);
  }, [streamChannel]);

  /**
   * Step 2 : setChannelMetadata
   */
  const setChannelMetadata = () => {
    setChannelMetadataRequestId.current = client
      .getStorage()
      .setChannelMetadata(cName, RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM,data: IMetadata[],
        options: MetadataOptions,
        lockName: string,);
  };

  /**
   * Step 3 : getChannelMetadata
   */
  const getChannelMetadata = () => {
    getChannelMetadataRequestId.current = client
      .getStorage()
      .getChannelMetadata(cName, RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM);
  };

  /**
   * Step 4 : updateChannelMetadata
   */
  const updateChannelMetadata = () => {};

  /**
   * Step 5 : removeChannelMetadata
   */
  const removeChannelMetadata = () => {};

  useEffect(() => {
    client.addEventListener('onJoinResult', onJoinResult);

    return () => {
      client.removeEventListener('onJoinResult', onJoinResult);
    };
  }, [client, uid, onJoinResult]);

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
    client?.addEventListener(
      'onGetChannelMetadataResult',
      onGetChannelMetadataResult
    );

    return () => {
      client?.removeEventListener(
        'onConnectionStateChanged',
        onConnectionStateChanged
      );
      client?.removeEventListener(
        'onGetChannelMetadataResult',
        onGetChannelMetadataResult
      );
    };
  }, [client, uid, onConnectionStateChanged, onGetChannelMetadataResult]);

  return (
    <>
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
          title={`setChannelMetadata`}
          onPress={() => {
            setChannelMetadata();
          }}
        />
        <AgoraButton
          title={`getChannelMetadata`}
          onPress={() => {
            getChannelMetadata();
          }}
        />
        <AgoraButton
          title={`updateChannelMetadata`}
          onPress={() => {
            updateChannelMetadata();
          }}
        />
        <AgoraButton
          title={`removeChannelMetadata`}
          onPress={() => {
            removeChannelMetadata();
          }}
        />
        {/* <AgoraTextInput
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

        <AgoraDropdown
          titleStyle={AgoraStyle.dropdownTitle}
          title={'what is your location?'}
          items={arrayToItems(['tokyo', 'shanghai', 'beijing'])}
          value={location}
          onValueChange={(value) => {
            setLocation(value);
          }}
        /> */}
        {/* <AgoraTextInput
          onChangeText={(text) => {
            setFeeling(text);
          }}
          label="How do you feel now?"
          value={feeling}
        /> */}
      </ScrollView>
    </>
  );
}
