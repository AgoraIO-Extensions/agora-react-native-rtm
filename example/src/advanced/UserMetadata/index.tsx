import { Metadata, MetadataItem, useRtm } from 'agora-react-native-rtm';
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

export default function UserMetadata() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [subscribeUserMetadataSuccess, setSubscribeUserMetadataSuccess] =
    useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [cName, setCName] = useState<string>(Config.channelName);
  const [uid] = useState<string>(Config.uid);
  const [subscribeUid, setSubscribeUid] = useState<string>('123');
  const [metadataKey, setMetadataKey] = useState<string>('profile');
  const [metadataValue, setMetadataValue] = useState<string>('I am a student');
  const [majorRevision, setMajorRevision] = useState<number>(-1);
  const [revision, setRevision] = useState<number>(-1);
  const [addTimeStamp, setAddTimeStamp] = useState<boolean>(true);
  const [addUserId, setAddUserId] = useState<boolean>(true);

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
      log.alert('getUserMetadata', JSON.stringify(result));
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
    } catch (status: any) {
      log.error('unsubscribeUserMetadata error', status);
    }
  };

  const handleLoginStatus = useCallback((status: boolean) => {
    setLoginSuccess(status);
    if (!status) {
      setSubscribeSuccess(false);
      setSubscribeUserMetadataSuccess(false);
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
