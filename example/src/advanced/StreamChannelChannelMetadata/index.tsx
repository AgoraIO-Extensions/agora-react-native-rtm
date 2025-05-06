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
import {
  AgoraButton,
  AgoraDivider,
  AgoraStyle,
  AgoraSwitch,
  AgoraTextInput,
} from '../../components/ui';
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
  const [addTimeStamp, setAddTimeStamp] = useState<boolean>(true);
  const [addUserId, setAddUserId] = useState<boolean>(true);

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
    log.info('createStreamChannel success', result);
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
   * Step 1-3 : leave message channel
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
   * Step 1-4 : destroyStreamChannel
   */
  const destroyStreamChannel = useCallback(() => {
    streamChannel?.release();
    setStreamChannel(undefined);
    log.info('destroyStreamChannel success');
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
      let result = await client.storage.setChannelMetadata(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM,
        metadata.current,
        {
          majorRevision: -1,
          lockName: lockName,
          addTimeStamp: addTimeStamp,
          addUserId: addUserId,
        }
      );
      log.info('setChannelMetadata success', result);
    } catch (status: any) {
      log.error('setChannelMetadata error', status);
    }
  };

  /**
   * Step 3 : getChannelMetadata
   */
  const getChannelMetadata = async () => {
    try {
      let result = await client.storage.getChannelMetadata(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM
      );
      log.info('getChannelMetadata success', result);
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
      let result = await client.storage.updateChannelMetadata(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM,
        metadata.current,
        {
          majorRevision: -1,
          lockName: lockName,
          addTimeStamp: addTimeStamp,
          addUserId: addUserId,
        }
      );
      log.info('updateChannelMetadata success', result);
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
      let result = await client.storage.removeChannelMetadata(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM,
        {
          majorRevision: -1,
          lockName: lockName,
          addTimeStamp: addTimeStamp,
          addUserId: addUserId,
        }
      );
      log.info('removeChannelMetadata success', result);
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
        <AgoraDivider />
        <AgoraSwitch
          title="addTimeStamp"
          value={addTimeStamp}
          onValueChange={(v) => {
            setAddTimeStamp(v);
          }}
        />
        <AgoraSwitch
          title="addUserId"
          value={addUserId}
          onValueChange={(v) => {
            setAddUserId(v);
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
