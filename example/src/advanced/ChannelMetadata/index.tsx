import {
  Metadata,
  MetadataItem,
  MetadataOptions,
  RTM_CHANNEL_TYPE,
  RTM_CONNECTION_CHANGE_REASON,
  RTM_CONNECTION_STATE,
  RTM_ERROR_CODE,
  useRtm,
} from 'agora-react-native-rtm';
import React, { useCallback, useEffect, useRef, useState } from 'react';

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

export default function ChannelMetadata() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [cName, setCName] = useState<string>(Config.channelName);
  const acquireLockRequestId = useRef<number>();
  const [retry, setRetry] = useState<boolean>(false);
  const getChannelMetadataRequestId = useRef<number>();
  const setChannelMetadataRequestId = useRef<number>();
  const removeChannelMetadataRequestId = useRef<number>();
  const updateChannelMetadataRequestId = useRef<number>();
  const [uid, setUid] = useState<string>(Config.uid);
  const [metadataKey, setMetadataKey] = useState<string>('channel notice');
  const [metadataValue, setMetadataValue] = useState<string>('rtm test');
  const [majorRevision, setMajorRevision] = useState<number>(-1);
  const [revision, setRevision] = useState<number>(-1);
  const [lockName, setLockName] = useState<string>('');

  const metadata = useRef<Metadata>(
    new Metadata({
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

  const onAcquireLockResult = useCallback(
    (
      requestId: number,
      channelName: string,
      channelType: RTM_CHANNEL_TYPE,
      _lockName: string,
      errorCode: RTM_ERROR_CODE,
      errorDetails: string
    ) => {
      log.info(
        'onAcquireLockResult',
        'requestId',
        requestId,
        'channelName',
        channelName,
        'channelType',
        channelType,
        'lockName',
        _lockName,
        'errorCode',
        errorCode,
        'errorDetails',
        errorDetails
      );
      if (errorCode !== RTM_ERROR_CODE.RTM_ERROR_OK) {
        log.error(`acquire lock failed: errorCode: ${errorCode}`);
      }
    },
    []
  );

  const onGetChannelMetadataResult = useCallback(
    (
      requestId: number,
      channelName: string,
      channelType: RTM_CHANNEL_TYPE,
      data: RtmMetadata,
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

  const onSetChannelMetadataResult = useCallback(
    (
      requestId: number,
      channelName: string,
      channelType: RTM_CHANNEL_TYPE,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.info(
        'onSetChannelMetadataResult',
        'requestId',
        requestId,
        'channelName',
        channelName,
        'channelType',
        channelType,
        'errorCode',
        errorCode
      );
      if (
        requestId === setChannelMetadataRequestId.current &&
        errorCode === RTM_ERROR_CODE.RTM_ERROR_OK
      ) {
        log.alert(`setChannelMetadata success`, `channelName: ${channelName}`);
      }
    },
    []
  );

  const onRemoveChannelMetadataResult = useCallback(
    (
      requestId: number,
      channelName: string,
      channelType: RTM_CHANNEL_TYPE,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.info(
        'onRemoveChannelMetadataResult',
        'requestId',
        requestId,
        'channelName',
        channelName,
        'channelType',
        channelType,
        'errorCode',
        errorCode
      );
      if (
        requestId === removeChannelMetadataRequestId.current &&
        errorCode === RTM_ERROR_CODE.RTM_ERROR_OK
      ) {
        log.alert(
          `removeChannelMetadata success`,
          `channelName: ${channelName}`
        );
      }
    },
    []
  );

  const onUpdateChannelMetadataResult = useCallback(
    (
      requestId: number,
      channelName: string,
      channelType: RTM_CHANNEL_TYPE,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.info(
        'onUpdateChannelMetadataResult',
        'requestId',
        requestId,
        'channelName',
        channelName,
        'channelType',
        channelType,
        'errorCode',
        errorCode
      );
      if (
        requestId === updateChannelMetadataRequestId.current &&
        errorCode === RTM_ERROR_CODE.RTM_ERROR_OK
      ) {
        log.alert(
          `updateChannelMetadata success`,
          `channelName: ${channelName}`
        );
      }
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
   * Step 1-2 : unsubscribe message channel
   */
  const unsubscribe = () => {
    client.unsubscribe(cName);
    setSubscribeSuccess(false);
  };

  /**
   * Step 2 : setChannelMetadata
   */
  const setChannelMetadata = () => {
    metadata.current.metadataItems = [
      new MetadataItem({
        key: metadataKey,
        value: metadataValue,
        revision: revision,
        authorUserId: uid,
      }),
    ];
    metadata.current.metadataItemsSize = 1;
    setChannelMetadataRequestId.current = client
      .getStorage()
      .setChannelMetadata(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
        metadata.current,
        new MetadataOptions({ recordUserId: true }),
        lockName
      );
  };

  /**
   * Step 3 : getChannelMetadata
   */
  const getChannelMetadata = () => {
    getChannelMetadataRequestId.current = client
      .getStorage()
      .getChannelMetadata(cName, RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE);
  };

  /**
   * Step 3-1 : acquireLock
   */
  const acquireLock = () => {
    acquireLockRequestId.current = client
      .getLock()
      .acquireLock(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
        lockName,
        retry
      );
  };

  /**
   * Step 4 : updateChannelMetadata
   */
  const updateChannelMetadata = () => {
    metadata.current.metadataItems = [
      new MetadataItem({
        key: metadataKey,
        value: metadataValue,
        revision: revision,
        authorUserId: uid,
      }),
    ];
    metadata.current.metadataItemsSize = 1;
    updateChannelMetadataRequestId.current = client
      .getStorage()
      .updateChannelMetadata(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
        metadata.current,
        new MetadataOptions({ recordUserId: true }),
        lockName
      );
  };

  /**
   * Step 5 : removeChannelMetadata
   */
  const removeChannelMetadata = () => {
    metadata.current.metadataItems = [
      new MetadataItem({
        key: metadataKey,
        value: metadataValue,
        revision: revision,
        authorUserId: uid,
      }),
    ];
    metadata.current.metadataItemsSize = 1;
    removeChannelMetadataRequestId.current = client
      .getStorage()
      .removeChannelMetadata(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
        metadata.current,
        new MetadataOptions({ recordUserId: true }),
        lockName
      );
  };

  useEffect(() => {
    client.addEventListener('onSubscribeResult', onSubscribeResult);
    client.addEventListener(
      'onSetChannelMetadataResult',
      onSetChannelMetadataResult
    );
    client?.addEventListener('onAcquireLockResult', onAcquireLockResult);
    client?.addEventListener(
      'onGetChannelMetadataResult',
      onGetChannelMetadataResult
    );
    client?.addEventListener(
      'onRemoveChannelMetadataResult',
      onRemoveChannelMetadataResult
    );
    client?.addEventListener(
      'onUpdateChannelMetadataResult',
      onUpdateChannelMetadataResult
    );

    return () => {
      client.removeEventListener('onSubscribeResult', onSubscribeResult);
      client.removeEventListener(
        'onSetChannelMetadataResult',
        onSetChannelMetadataResult
      );
      client?.removeEventListener('onAcquireLockResult', onAcquireLockResult);
      client?.removeEventListener(
        'onGetChannelMetadataResult',
        onGetChannelMetadataResult
      );
      client?.removeEventListener(
        'onRemoveChannelMetadataResult',
        onRemoveChannelMetadataResult
      );
      client?.removeEventListener(
        'onUpdateChannelMetadataResult',
        onUpdateChannelMetadataResult
      );
    };
  }, [
    client,
    uid,
    onSubscribeResult,
    onAcquireLockResult,
    onSetChannelMetadataResult,
    onGetChannelMetadataResult,
    onRemoveChannelMetadataResult,
    onUpdateChannelMetadataResult,
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
