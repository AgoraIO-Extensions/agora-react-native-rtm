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

export default function UserMetadata() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [subscribeUserMetadataSuccess, setSubscribeUserMetadataSuccess] =
    useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [streamChannel, setStreamChannel] = useState<RTMStreamChannel>();
  const [cName, setCName] = useState<string>(Config.channelName);
  const [channelType, setChannelType] = useState<number>(
    RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE
  );
  const [uid] = useState<string>(Config.uid);
  const [subscribeUid, setSubscribeUid] = useState<string>('123');
  const [metadataKey, setMetadataKey] = useState<string>('profile');
  const [metadataValue, setMetadataValue] = useState<string>('I am a student');
  const [majorRevision, setMajorRevision] = useState<number>(-1);
  const [revision, setRevision] = useState<number>(-1);
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
      await client.subscribe(cName, {
        withMessage: withMessage,
        withMetadata: withMetadata,
        withPresence: withPresence,
        withLock: withLock,
      });
      setSubscribeSuccess(true);
      log.info('subscribe success');
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
      log.info('unsubscribe success');
    } catch (status: any) {
      log.error('unsubscribe error', status);
    }
  };

  /**
   * Step 2 : setUserMetadata
   */
  const setUserMetadata = async () => {
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
      await client.storage.setUserMetadata(metadata.current, {
        userId: uid,
        majorRevision: majorRevision,
        addUserId: addUserId,
        addTimeStamp: addTimeStamp,
      });
      log.info('setUserMetadata success');
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
      log.info('getUserMetadata success', result);
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
          revision: revision,
          authorUserId: uid,
        }),
      ];
      metadata.current.itemCount = 1;
      await client.storage.updateUserMetadata(metadata.current, {
        userId: uid,
        majorRevision: majorRevision,
        addUserId: addUserId,
        addTimeStamp: addTimeStamp,
      });
      log.info('updateUserMetadata success');
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
          revision: revision,
          authorUserId: uid,
        }),
      ];
      metadata.current.itemCount = 1;
      await client.storage.removeUserMetadata({
        data: metadata.current,
        userId: uid,
        majorRevision: majorRevision,
        addUserId: addUserId,
        addTimeStamp: addTimeStamp,
      });
      log.info('removeUserMetadata success');
    } catch (status: any) {
      log.error('removeUserMetadata error', status);
    }
  };

  /**
   * Step 6 : subscribeUserMetadata
   */
  const subscribeUserMetadata = async () => {
    try {
      await client.storage.subscribeUserMetadata(subscribeUid);
      setSubscribeUserMetadataSuccess(true);
      log.info('subscribeUserMetadata success');
    } catch (status: any) {
      log.error('subscribeUserMetadata error', status);
    }
  };

  /**
   * Step 7 : unsubscribeUserMetadata
   */
  const unsubscribeUserMetadata = async () => {
    try {
      await client.storage.unsubscribeUserMetadata(subscribeUid);
      setSubscribeUserMetadataSuccess(false);
      log.info('unsubscribeUserMetadata success');
    } catch (status: any) {
      log.error('unsubscribeUserMetadata error', status);
    }
  };

  const handleLoginStatus = useCallback((status: boolean) => {
    setLoginSuccess(status);
    if (!status) {
      setJoinSuccess(false);
      setSubscribeSuccess(false);
      setSubscribeUserMetadataSuccess(false);
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
            if (!text) return;
            setRevision(parseInt(text, 10));
          }}
          label="revision"
          value={revision.toString()}
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
        <AgoraButton
          title={`setUserMetadata`}
          disabled={!loginSuccess}
          onPress={() => {
            setUserMetadata();
          }}
        />
        <AgoraButton
          title={`getUserMetadata`}
          disabled={!loginSuccess}
          onPress={() => {
            getUserMetadata();
          }}
        />
        <AgoraButton
          title={`updateUserMetadata`}
          disabled={!loginSuccess}
          onPress={() => {
            updateUserMetadata();
          }}
        />
        <AgoraButton
          title={`removeUserMetadata`}
          disabled={!loginSuccess}
          onPress={() => {
            removeUserMetadata();
          }}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            setSubscribeUid(text);
          }}
          placeholder="input uid you want to subscribe"
          label="subscribeUid"
          value={subscribeUid}
          disabled={subscribeUserMetadataSuccess}
        />
        <AgoraButton
          title={
            subscribeUserMetadataSuccess
              ? `unsubscribeUserMetadata`
              : `subscribeUserMetadata`
          }
          disabled={!loginSuccess}
          onPress={() => {
            subscribeUserMetadataSuccess
              ? unsubscribeUserMetadata()
              : subscribeUserMetadata();
          }}
        />
      </ScrollView>
    </>
  );
}
