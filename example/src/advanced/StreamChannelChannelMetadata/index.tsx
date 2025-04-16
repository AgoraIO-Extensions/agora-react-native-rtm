import {
  JoinChannelOptions,
  Metadata,
  MetadataItem,
  RTMStreamChannel,
  RTM_CHANNEL_TYPE,
  useRtm,
} from 'agora-react-native-rtm';
import React, { useCallback, useRef, useState } from 'react';

import { ScrollView } from 'react-native';

import BaseComponent from '../../components/BaseComponent';
import { AgoraButton, AgoraStyle, AgoraTextInput } from '../../components/ui';
import Config from '../../config/agora.config';
import * as log from '../../utils/log';

export default function StreamChannelChannelMetadata() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [streamChannel, setStreamChannel] = useState<RTMStreamChannel>();
  const [cName, setCName] = useState<string>(Config.channelName);
  const [uid] = useState<string>(Config.uid);
  const [metadataKey, setMetadataKey] = useState<string>('channel notice');
  const [metadataValue, setMetadataValue] = useState<string>('rtm test');
  const [lockName, setLockName] = useState<string>('');

  const metadata = useRef<Metadata>(
    new Metadata({
      majorRevision: -1,
      items: [],
      itemCount: 0,
    })
  );

  /**
   * Step 1: getRtmClient and initialize rtm client from BaseComponent
   */
  const client = useRtm();

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
   * Step 1-3 : leave message channel
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
   * Step 1-4 : destroyStreamChannel
   */
  const destroyStreamChannel = useCallback(() => {
    streamChannel?.release();
    setStreamChannel(undefined);
  }, [streamChannel]);

  /**
   * Step 2 : setChannelMetadata
   */
  const setChannelMetadata = async () => {
    metadata.current.items = [
      new MetadataItem({
        key: metadataKey,
        value: metadataValue,
        authorUserId: uid,
      }),
    ];
    metadata.current.itemCount = 1;
    try {
      const result = await client.storage.setChannelMetadata(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM,
        metadata.current,
        {
          majorRevision: -1,
          lockName: lockName,
          addTimeStamp: false,
          addUserId: true,
        }
      );
      log.alert('setChannelMetadata result', `${JSON.stringify(result)}`);
    } catch (status: any) {
      log.error('setChannelMetadata error', status);
    }
  };

  /**
   * Step 3 : getChannelMetadata
   */
  const getChannelMetadata = async () => {
    try {
      const result = await client.storage.getChannelMetadata(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM
      );
      log.alert('getChannelMetadata result', `${JSON.stringify(result)}`);
    } catch (status: any) {
      log.error('getChannelMetadata error', status);
    }
  };

  /**
   * Step 4 : updateChannelMetadata
   */
  const updateChannelMetadata = async () => {
    metadata.current.items = [
      new MetadataItem({
        key: metadataKey,
        value: metadataValue,
        authorUserId: uid,
      }),
    ];
    metadata.current.itemCount = 1;
    try {
      const result = await client.storage.updateChannelMetadata(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM,
        metadata.current,
        {
          majorRevision: -1,
          lockName: lockName,
          addTimeStamp: false,
          addUserId: true,
        }
      );
      log.alert('updateChannelMetadata result', `${JSON.stringify(result)}`);
    } catch (status: any) {
      log.error('updateChannelMetadata error', status);
    }
  };

  /**
   * Step 5 : removeChannelMetadata
   */
  const removeChannelMetadata = async () => {
    metadata.current.items = [
      new MetadataItem({
        key: metadataKey,
        value: metadataValue,
        authorUserId: uid,
      }),
    ];
    metadata.current.itemCount = 1;
    try {
      const result = await client.storage.removeChannelMetadata(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM,
        {
          majorRevision: -1,
          lockName: lockName,
          addTimeStamp: false,
          addUserId: true,
        }
      );
      log.alert('removeChannelMetadata result', `${JSON.stringify(result)}`);
    } catch (status: any) {
      log.error('removeChannelMetadata error', status);
    }
  };

  const handleLoginStatus = useCallback((status: boolean) => {
    setLoginSuccess(status);
    if (!status) {
      setJoinSuccess(false);
      setStreamChannel(undefined);
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
        <AgoraTextInput
          onChangeText={(text) => {
            setMetadataKey(text);
          }}
          label="metadata key"
          value={metadataKey}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            setMetadataValue(text);
          }}
          label="metadata value"
          value={metadataValue}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            setLockName(text);
          }}
          label="lockName value"
          value={lockName}
        />
        <AgoraButton
          title={`setChannelMetadata`}
          disabled={!loginSuccess}
          onPress={() => {
            setChannelMetadata();
          }}
        />
        <AgoraButton
          title={`getChannelMetadata`}
          disabled={!loginSuccess}
          onPress={() => {
            getChannelMetadata();
          }}
        />
        <AgoraButton
          title={`updateChannelMetadata`}
          disabled={!loginSuccess}
          onPress={() => {
            updateChannelMetadata();
          }}
        />
        <AgoraButton
          title={`removeChannelMetadata`}
          disabled={!loginSuccess}
          onPress={() => {
            removeChannelMetadata();
          }}
        />
      </ScrollView>
    </>
  );
}
