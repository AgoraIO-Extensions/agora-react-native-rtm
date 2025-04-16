import {
  Metadata,
  MetadataItem,
  RTM_CHANNEL_TYPE,
  useRtm,
} from 'agora-react-native-rtm';
import React, { useCallback, useRef, useState } from 'react';

import { ScrollView } from 'react-native';

import BaseComponent from '../../components/BaseComponent';
import {
  AgoraButton,
  AgoraStyle,
  AgoraSwitch,
  AgoraTextInput,
} from '../../components/ui';
import Config from '../../config/agora.config';
import * as log from '../../utils/log';

export default function ChannelMetadata() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [cName, setCName] = useState<string>(Config.channelName);
  const [retry, setRetry] = useState<boolean>(false);
  const [uid] = useState<string>(Config.uid);
  const [metadataKey, setMetadataKey] = useState<string>('channel notice');
  const [metadataValue, setMetadataValue] = useState<string>('rtm test');
  const [majorRevision, setMajorRevision] = useState<number>(-1);
  const [revision, setRevision] = useState<number>(-1);
  const [lockName, setLockName] = useState<string>('');

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
   * Step 1-1(optional) : subscribe message channel
   */
  const subscribe = async () => {
    try {
      await client.subscribe(cName, {
        withMessage: true,
        withMetadata: true,
        withPresence: true,
        withLock: true,
      });
      setSubscribeSuccess(true);
    } catch (status: any) {
      log.error('subscribe error', status);
    }
  };

  /**
   * Step 1-2 : unsubscribe message channel
   */
  const unsubscribe = async () => {
    try {
      await client.unsubscribe(cName);
      setSubscribeSuccess(false);
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
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
        metadata.current,
        {
          majorRevision: majorRevision,
          lockName: lockName,
          addTimeStamp: false,
          addUserId: true,
        }
      );
      log.alert(`${uid} setChannelMetadata:`, `${JSON.stringify(result)}`);
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
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE
      );
      log.alert(`${uid} getChannelMetadata:`, `${JSON.stringify(result)}`);
    } catch (status: any) {
      log.error('getChannelMetadata error', status);
    }
  };

  /**
   * Step 3-1 : acquireLock
   */
  const acquireLock = async () => {
    try {
      let result = await client.lock.acquireLock(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
        lockName,
        { retry }
      );
      log.alert(`${uid} acquireLock:`, `${JSON.stringify(result)}`);
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
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
        metadata.current,
        {
          majorRevision: majorRevision,
          lockName: lockName,
          addTimeStamp: false,
          addUserId: true,
        }
      );
      log.alert(`${uid} updateChannelMetadata:`, `${JSON.stringify(result)}`);
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
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
        {
          data: metadata.current,
        }
      );
      log.alert(`${uid} removeChannelMetadata:`, `${JSON.stringify(result)}`);
    } catch (status: any) {
      log.error('removeChannelMetadata error', status);
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
          onPress={() => {
            subscribeSuccess ? unsubscribe() : subscribe();
          }}
        />
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
        <AgoraSwitch
          title="retry"
          value={retry}
          onValueChange={(v) => {
            setRetry(v);
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
