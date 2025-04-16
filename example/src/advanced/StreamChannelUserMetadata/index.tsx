import {
  JoinChannelOptions,
  Metadata,
  MetadataItem,
  RTMStreamChannel,
  useRtm,
} from 'agora-react-native-rtm';
import React, { useCallback, useRef, useState } from 'react';

import { ScrollView } from 'react-native';

import BaseComponent from '../../components/BaseComponent';
import { AgoraButton, AgoraStyle, AgoraTextInput } from '../../components/ui';
import Config from '../../config/agora.config';
import * as log from '../../utils/log';

export default function StreamChannelUserMetadata() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [streamChannel, setStreamChannel] = useState<RTMStreamChannel>();
  const [cName, setCName] = useState<string>(Config.channelName);
  const [uid] = useState<string>(Config.uid);
  const [subscribeUid, setSubscribeUid] = useState<string>('123');
  const [metadataKey, setMetadataKey] = useState<string>('profile');
  const [metadataValue, setMetadataValue] = useState<string>('I am a student');

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
   * Step 2 : setUserMetadata
   */
  const setUserMetadata = async () => {
    metadata.current.items = [
      new MetadataItem({
        key: metadataKey,
        value: metadataValue,
        authorUserId: uid,
      }),
    ];
    metadata.current.itemCount = 1;
    try {
      const result = await client.storage.setUserMetadata(metadata.current, {
        userId: uid,
        majorRevision: -1,
        addTimeStamp: false,
        addUserId: true,
      });
      log.alert('setUserMetadata result', `${JSON.stringify(result)}`);
    } catch (status: any) {
      log.error('setUserMetadata error', status);
    }
  };

  /**
   * Step 3 : getUserMetadata
   */
  const getUserMetadata = async () => {
    try {
      const result = await client.storage.getUserMetadata({
        userId: uid,
      });
      log.alert('getUserMetadata result', `${JSON.stringify(result)}`);
    } catch (status: any) {
      log.error('getUserMetadata error', status);
    }
  };

  /**
   * Step 4 : updateUserMetadata
   */
  const updateUserMetadata = async () => {
    try {
      metadata.current.items = [
        new MetadataItem({
          key: metadataKey,
          value: metadataValue,
          authorUserId: uid,
        }),
      ];
      metadata.current.itemCount = 1;
      const result = await client.storage.updateUserMetadata(metadata.current, {
        userId: uid,
        majorRevision: -1,
        addTimeStamp: false,
        addUserId: true,
      });
      log.alert('updateUserMetadata result', `${JSON.stringify(result)}`);
    } catch (status: any) {
      log.error('updateUserMetadata error', status);
    }
  };

  /**
   * Step 5 : removeUserMetadata
   */
  const removeUserMetadata = async () => {
    try {
      metadata.current.items = [
        new MetadataItem({
          key: metadataKey,
          value: metadataValue,
          authorUserId: uid,
        }),
      ];
      metadata.current.itemCount = 1;
      const result = await client.storage.removeUserMetadata({
        userId: uid,
        majorRevision: -1,
        addTimeStamp: false,
        addUserId: true,
      });
      log.alert('removeUserMetadata result', `${JSON.stringify(result)}`);
    } catch (status: any) {
      log.error('removeUserMetadata error', status);
    }
  };

  /**
   * Step 6 : subscribeUserMetadata
   */
  const subscribeUserMetadata = async () => {
    try {
      const result = await client.storage.subscribeUserMetadata(subscribeUid);
      log.alert('subscribeUserMetadata result', `${JSON.stringify(result)}`);
    } catch (status: any) {
      log.error('subscribeUserMetadata error', status);
    }
  };

  /**
   * Step 7 : unsubscribeUserMetadata
   */
  const unsubscribeUserMetadata = async () => {
    try {
      const result = await client.storage.unsubscribeUserMetadata(subscribeUid);
      log.alert('unsubscribeUserMetadata result', `${JSON.stringify(result)}`);
      setSubscribeSuccess(false);
    } catch (status: any) {
      log.error('unsubscribeUserMetadata error', status);
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
        <AgoraButton
          title={`setUserMetadata`}
          disabled={!loginSuccess}
          onPress={async () => {
            await setUserMetadata();
          }}
        />
        <AgoraButton
          title={`getUserMetadata`}
          disabled={!loginSuccess}
          onPress={async () => {
            await getUserMetadata();
          }}
        />
        <AgoraButton
          title={`updateUserMetadata`}
          disabled={!loginSuccess}
          onPress={async () => {
            await updateUserMetadata();
          }}
        />
        <AgoraButton
          title={`removeUserMetadata`}
          disabled={!loginSuccess}
          onPress={async () => {
            await removeUserMetadata();
          }}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            setSubscribeUid(text);
          }}
          placeholder="input uid you want to subscribe"
          label="subscribeUid"
          value={subscribeUid}
          disabled={subscribeSuccess}
        />
        <AgoraButton
          title={
            subscribeSuccess
              ? `unsubscribeUserMetadata`
              : `subscribeUserMetadata`
          }
          disabled={!loginSuccess}
          onPress={async () => {
            subscribeSuccess
              ? await unsubscribeUserMetadata()
              : await subscribeUserMetadata();
          }}
        />
      </ScrollView>
    </>
  );
}
