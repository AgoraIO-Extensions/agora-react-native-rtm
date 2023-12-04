import {
  MetadataItem,
  MetadataOptions,
  RTM_CONNECTION_CHANGE_REASON,
  RTM_CONNECTION_STATE,
  RTM_ERROR_CODE,
  RtmMetadata,
} from 'agora-react-native-rtm';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { ScrollView } from 'react-native';

import BaseComponent from '../../components/BaseComponent';
import { AgoraButton, AgoraStyle, AgoraTextInput } from '../../components/ui';
import Config from '../../config/agora.config';
import { useRtmClient } from '../../hooks/useRtmClient';
import * as log from '../../utils/log';

export default function UserMetadata() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [subscribeUserMetadataSuccess, setSubscribeUserMetadataSuccess] =
    useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [cName, setCName] = useState<string>(Config.channelName);
  const getUserMetadataRequestId = useRef<number>();
  const setUserMetadataRequestId = useRef<number>();
  const removeUserMetadataRequestId = useRef<number>();
  const updateUserMetadataRequestId = useRef<number>();
  const subscribeUserMetadataRequestId = useRef<number>();
  const [uid, setUid] = useState<string>(Config.uid);
  const [subscribeUid, setSubscribeUid] = useState<string>('123');
  const [metadataKey, setMetadataKey] = useState<string>('profile');
  const [metadataValue, setMetadataValue] = useState<string>('I am a student');
  const [majorRevision, setMajorRevision] = useState<number>(-1);
  const [revision, setRevision] = useState<number>(-1);

  const metadata = useRef<RtmMetadata>(
    new RtmMetadata({
      majorRevision: majorRevision,
      metadataItems: [],
      metadataItemsSize: 0,
    })
  );

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

  const onGetUserMetadataResult = useCallback(
    (
      requestId: number,
      userId: string,
      data: RtmMetadata,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.info(
        'onGetUserMetadataResult',
        'requestId',
        requestId,
        'userId',
        userId,
        'data',
        data,
        'errorCode',
        errorCode
      );
      if (
        requestId === getUserMetadataRequestId.current &&
        errorCode === RTM_ERROR_CODE.RTM_ERROR_OK
      ) {
        log.alert(`${userId} metadata:`, `${JSON.stringify(data)}`);
      }
    },
    []
  );

  const onSetUserMetadataResult = useCallback(
    (requestId: number, userId: string, errorCode: RTM_ERROR_CODE) => {
      log.info(
        'onSetUserMetadataResult',
        'requestId',
        requestId,
        'userId',
        userId,
        'errorCode',
        errorCode
      );
      if (
        requestId === setUserMetadataRequestId.current &&
        errorCode === RTM_ERROR_CODE.RTM_ERROR_OK
      ) {
        log.alert(`setUserMetadata success`, `userId: ${userId}`);
      }
    },
    []
  );

  const onRemoveUserMetadataResult = useCallback(
    (requestId: number, userId: string, errorCode: RTM_ERROR_CODE) => {
      log.info(
        'onRemoveUserMetadataResult',
        'requestId',
        requestId,
        'userId',
        userId,
        'errorCode',
        errorCode
      );
      if (
        requestId === removeUserMetadataRequestId.current &&
        errorCode === RTM_ERROR_CODE.RTM_ERROR_OK
      ) {
        log.alert(`removeUserMetadata success`, `userId: ${userId}`);
      }
    },
    []
  );

  const onUpdateUserMetadataResult = useCallback(
    (requestId: number, userId: string, errorCode: RTM_ERROR_CODE) => {
      log.info(
        'onUpdateUserMetadataResult',
        'requestId',
        requestId,
        'userId',
        userId,
        'errorCode',
        errorCode
      );
      if (
        requestId === updateUserMetadataRequestId.current &&
        errorCode === RTM_ERROR_CODE.RTM_ERROR_OK
      ) {
        log.alert(`updateUserMetadata success`, `userId: ${userId}`);
      }
    },
    []
  );

  const onSubscribeUserMetadataResult = useCallback(
    (requestId: number, userId: string, errorCode: RTM_ERROR_CODE) => {
      log.log(
        'onSubscribeUserMetadataResult',
        'requestId',
        requestId,
        'userId',
        userId,
        'errorCode',
        errorCode
      );
      if (
        subscribeUserMetadataRequestId.current === requestId &&
        errorCode === RTM_ERROR_CODE.RTM_ERROR_OK
      ) {
        setSubscribeUserMetadataSuccess(true);
      }
    },
    []
  );

  /**
   * Step 1: getRtmClient and initialize rtm client from BaseComponent
   */
  const client = useRtmClient();

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
   * Step 1-2 : unsubscribe message channel
   */
  const unsubscribe = () => {
    client.unsubscribe(cName);
    setSubscribeSuccess(false);
  };

  /**
   * Step 2 : setUserMetadata
   */
  const setUserMetadata = () => {
    metadata.current.metadataItems = [
      new MetadataItem({
        key: metadataKey,
        value: metadataValue,
        revision: revision,
        authorUserId: uid,
      }),
    ];
    metadata.current.metadataItemsSize = 1;
    setUserMetadataRequestId.current = client
      .getStorage()
      .setUserMetadata(
        uid,
        metadata.current,
        new MetadataOptions({ recordUserId: true })
      );
  };

  /**
   * Step 3 : getUserMetadata
   */
  const getUserMetadata = () => {
    getUserMetadataRequestId.current = client.getStorage().getUserMetadata(uid);
  };

  /**
   * Step 4 : updateUserMetadata
   */
  const updateUserMetadata = () => {
    metadata.current.metadataItems = [
      new MetadataItem({
        key: metadataKey,
        value: metadataValue,
        revision: revision,
        authorUserId: uid,
      }),
    ];
    metadata.current.metadataItemsSize = 1;
    updateUserMetadataRequestId.current = client
      .getStorage()
      .updateUserMetadata(
        uid,
        metadata.current,
        new MetadataOptions({ recordUserId: true })
      );
  };

  /**
   * Step 5 : removeUserMetadata
   */
  const removeUserMetadata = () => {
    metadata.current.metadataItems = [
      new MetadataItem({
        key: metadataKey,
        value: metadataValue,
        revision: revision,
        authorUserId: uid,
      }),
    ];
    metadata.current.metadataItemsSize = 1;
    removeUserMetadataRequestId.current = client
      .getStorage()
      .removeUserMetadata(
        uid,
        metadata.current,
        new MetadataOptions({ recordUserId: true })
      );
  };

  /**
   * Step 6 : subscribeUserMetadata
   */
  const subscribeUserMetadata = () => {
    subscribeUserMetadataRequestId.current = client
      .getStorage()
      .subscribeUserMetadata(subscribeUid);
  };

  /**
   * Step 7 : unsubscribeUserMetadata
   */
  const unsubscribeUserMetadata = () => {
    let result = client.getStorage().unsubscribeUserMetadata(subscribeUid);
    if (result === RTM_ERROR_CODE.RTM_ERROR_OK) {
      setSubscribeUserMetadataSuccess(false);
    }
  };

  useEffect(() => {
    client.addEventListener('onSubscribeResult', onSubscribeResult);
    client.addEventListener('onSetUserMetadataResult', onSetUserMetadataResult);
    client?.addEventListener(
      'onGetUserMetadataResult',
      onGetUserMetadataResult
    );
    client?.addEventListener(
      'onRemoveUserMetadataResult',
      onRemoveUserMetadataResult
    );
    client?.addEventListener(
      'onUpdateUserMetadataResult',
      onUpdateUserMetadataResult
    );
    client?.addEventListener(
      'onSubscribeUserMetadataResult',
      onSubscribeUserMetadataResult
    );

    return () => {
      client.removeEventListener('onSubscribeResult', onSubscribeResult);
      client.removeEventListener(
        'onSetUserMetadataResult',
        onSetUserMetadataResult
      );
      client?.removeEventListener(
        'onGetUserMetadataResult',
        onGetUserMetadataResult
      );
      client?.removeEventListener(
        'onRemoveUserMetadataResult',
        onRemoveUserMetadataResult
      );
      client?.removeEventListener(
        'onUpdateUserMetadataResult',
        onUpdateUserMetadataResult
      );
      client.removeEventListener(
        'onSubscribeUserMetadataResult',
        onSubscribeUserMetadataResult
      );
    };
  }, [
    client,
    uid,
    onSubscribeResult,
    onSetUserMetadataResult,
    onGetUserMetadataResult,
    onRemoveUserMetadataResult,
    onUpdateUserMetadataResult,
    onSubscribeUserMetadataResult,
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
          setSubscribeUserMetadataSuccess(false);
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
        <AgoraTextInput
          onChangeText={(text) => {
            if (!text) return;
            setMajorRevision(parseInt(text, 10));
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
