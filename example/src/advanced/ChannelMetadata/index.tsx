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
  AgoraDropdown,
  AgoraStyle,
  AgoraSwitch,
  AgoraTextInput,
} from '../../components/ui';
import Config from '../../config/agora.config';
import { enumToItems } from '../../utils';
import * as log from '../../utils/log';

export default function ChannelMetadata() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [streamChannel, setStreamChannel] = useState<RTMStreamChannel>();
  const [cName, setCName] = useState<string>(Config.channelName);
  const [channelType, setChannelType] = useState<number>(
    RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE
  );
  const [retry, setRetry] = useState<boolean>(false);
  const [uid] = useState<string>(Config.uid);
  const [metadataKey, setMetadataKey] = useState<string>('channel notice');
  const [metadataValue, setMetadataValue] = useState<string>('rtm test');
  const [majorRevision, setMajorRevision] = useState<number>(-1);
  const [revision, setRevision] = useState<number>(-1);
  const [lockName, setLockName] = useState<string>('');
  const [addTimeStamp, setAddTimeStamp] = useState<boolean>(true);
  const [addUserId, setAddUserId] = useState<boolean>(true);
  const [withMessage, setWithMessage] = useState<boolean>(true);
  const [withMetadata, setWithMetadata] = useState<boolean>(true);
  const [withPresence, setWithPresence] = useState<boolean>(true);
  const [withLock, setWithLock] = useState<boolean>(true);

  const metadata = useRef<Metadata>(
    new Metadata({
      majorRevision: majorRevision,
      items: [],
      itemCount: 0,
    })
  );

  /**
   * Step 1: getRtmClient and initialize rtm client from BaseComponent
   */
  const client = useRtm();

  /**
   * createStreamChannel
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
   * Step 1-2 : unsubscribe message channel
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
   * Step 2 : setChannelMetadata
   */
  const setChannelMetadata = async () => {
    try {
      metadata.current.items = [
        new MetadataItem({
          key: metadataKey,
          value: metadataValue,
          revision: revision,
          authorUserId: uid,
        }),
      ];
      metadata.current.itemCount = 1;
      let result = await client.storage.setChannelMetadata(
        cName,
        channelType,
        metadata.current,
        {
          majorRevision: majorRevision,
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
      let result = await client.storage.getChannelMetadata(cName, channelType);
      log.info('getChannelMetadata success', result);
    } catch (status: any) {
      log.error('getChannelMetadata error', status);
    }
  };

  /**
   * Step 3-1 : acquireLock
   */
  const acquireLock = async () => {
    try {
      let result = await client.lock.acquireLock(cName, channelType, lockName, {
        retry,
      });
      log.info('acquireLock success', result);
    } catch (status: any) {
      log.error('acquireLock error', status);
    }
  };

  /**
   * Step 4 : updateChannelMetadata
   */
  const updateChannelMetadata = async () => {
    try {
      metadata.current.items = [
        new MetadataItem({
          key: metadataKey,
          value: metadataValue,
          revision: revision,
          authorUserId: uid,
        }),
      ];
      metadata.current.itemCount = 1;
      let result = await client.storage.updateChannelMetadata(
        cName,
        channelType,
        metadata.current,
        {
          majorRevision: majorRevision,
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
    try {
      metadata.current.items = [
        new MetadataItem({
          key: metadataKey,
          value: metadataValue,
          revision: revision,
          authorUserId: uid,
        }),
      ];
      metadata.current.itemCount = 1;
      let result = await client.storage.removeChannelMetadata(
        cName,
        channelType,
        {
          data: metadata.current,
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
      setSubscribeSuccess(false);
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
        {channelType === RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM && (
          <>
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
        <AgoraTextInput
          onChangeText={(text) => {
            if (!text) return;
            setMajorRevision(parseInt(text, 10));
            metadata.current.majorRevision = parseInt(text, 10);
          }}
          label="majorRevision"
          value={majorRevision.toString()}
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
        <AgoraDivider />
        <AgoraSwitch
          title="retry"
          value={retry}
          onValueChange={(v) => {
            setRetry(v);
          }}
        />
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
        <AgoraButton
          title={`acquireLock`}
          disabled={!loginSuccess}
          onPress={() => {
            acquireLock();
          }}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (!text) return;
            setRevision(parseInt(text, 10));
          }}
          label="revision"
          value={revision.toString()}
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
