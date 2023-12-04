import {
  LockDetail,
  RTM_CHANNEL_TYPE,
  RTM_CONNECTION_CHANGE_REASON,
  RTM_CONNECTION_STATE,
  RTM_ERROR_CODE,
} from 'agora-react-native-rtm';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { ScrollView } from 'react-native';

import BaseComponent from '../../components/BaseComponent';
import {
  AgoraButton,
  AgoraStyle,
  AgoraSwitch,
  AgoraText,
  AgoraTextInput,
} from '../../components/ui';
import Config from '../../config/agora.config';
import { useRtmClient } from '../../hooks/useRtmClient';
import * as log from '../../utils/log';

export default function Lock() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [cName, setCName] = useState<string>(Config.channelName);
  const acquireLockRequestId = useRef<number>();
  const setLockRequestId = useRef<number>();
  const getLocksRequestId = useRef<number>();
  const releaseLockRequestId = useRef<number>();
  const revokeLockRequestId = useRef<number>();
  const removeLockRequestId = useRef<number>();
  const [uid, setUid] = useState<string>(Config.uid);
  const [lockDetailList, setLockDetailList] = useState<LockDetail[]>([]);

  const [lockName, setLockName] = useState<string>('lock-test');
  const [ttl, setTtl] = useState<number>(10);
  const [retry, setRetry] = useState<boolean>(false);
  const [revokeOwner, setRevokeOwner] = useState<string>('');

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

  const onReleaseLockResult = useCallback(
    (
      requestId: number,
      channelName: string,
      channelType: RTM_CHANNEL_TYPE,
      _lockName: string,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.info(
        'onReleaseLockResult',
        'requestId',
        requestId,
        'channelName',
        channelName,
        'channelType',
        channelType,
        'lockName',
        _lockName,
        'errorCode',
        errorCode
      );
    },
    []
  );

  const onSetLockResult = useCallback(
    (
      requestId: number,
      channelName: string,
      channelType: RTM_CHANNEL_TYPE,
      _lockName: string,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.info(
        'onSetLockResult',
        'requestId',
        requestId,
        'channelName',
        channelName,
        'channelType',
        channelType,
        'errorCode',
        'lockName',
        _lockName,
        'errorCode',
        errorCode
      );
      if (errorCode !== RTM_ERROR_CODE.RTM_ERROR_OK) {
        log.error(`setLock failed: errorCode: ${errorCode}`);
      }
    },
    []
  );

  const onRevokeLockResult = useCallback(
    (
      requestId: number,
      channelName: string,
      channelType: RTM_CHANNEL_TYPE,
      _lockName: string,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.info(
        'onRevokeLockResult',
        'requestId',
        requestId,
        'channelName',
        channelName,
        'channelType',
        channelType,
        'lockName',
        _lockName,
        'errorCode',
        errorCode
      );
      if (errorCode !== RTM_ERROR_CODE.RTM_ERROR_OK) {
        log.error(`revokeLock failed: errorCode: ${errorCode}`);
      }
    },
    []
  );

  const onRemoveLockResult = useCallback(
    (
      requestId: number,
      channelName: string,
      channelType: RTM_CHANNEL_TYPE,
      _lockName: string,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.info(
        'onRemoveLockResult',
        'requestId',
        requestId,
        'channelName',
        channelName,
        'channelType',
        channelType,
        'lockName',
        _lockName,
        'errorCode',
        errorCode
      );
      if (errorCode !== RTM_ERROR_CODE.RTM_ERROR_OK) {
        log.error(`removeLock failed: errorCode: ${errorCode}`);
      }
    },
    []
  );

  const onGetLocksResult = useCallback(
    (
      requestId: number,
      channelName: string,
      channelType: RTM_CHANNEL_TYPE,
      _lockDetailList: LockDetail[],
      count: number,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.log(
        'onGetLocksResult',
        'requestId',
        requestId,
        'channelName',
        channelName,
        'channelType',
        channelType,
        'lockDetailList',
        _lockDetailList,
        'count',
        count,
        'errorCode',
        errorCode
      );
      if (
        requestId === getLocksRequestId.current &&
        errorCode === RTM_ERROR_CODE.RTM_ERROR_OK
      ) {
        setLockDetailList(_lockDetailList);
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
   * Step 1-3 : getLocks
   */
  const getLocks = () => {
    getLocksRequestId.current = client
      .getLock()
      .getLocks(cName, RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE);
  };

  /**
   * Step 2 : setLock
   */
  const setLock = () => {
    setLockRequestId.current = client
      .getLock()
      .setLock(cName, RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE, lockName, ttl);
  };

  /**
   * Step 3 : acquireLock
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
   * Step 4 : releaseLock
   */
  const releaseLock = () => {
    releaseLockRequestId.current = client
      .getLock()
      .releaseLock(cName, RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE, lockName);
  };

  /**
   * Step 5 : revokeLock
   */
  const revokeLock = () => {
    revokeLockRequestId.current = client
      .getLock()
      .revokeLock(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
        lockName,
        revokeOwner
      );
  };

  /**
   * Step 5 : removeLock
   */
  const removeLock = () => {
    removeLockRequestId.current = client
      .getLock()
      .removeLock(cName, RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE, lockName);
  };

  useEffect(() => {
    client.addEventListener('onSubscribeResult', onSubscribeResult);
    client.addEventListener('onSetLockResult', onSetLockResult);
    client?.addEventListener('onAcquireLockResult', onAcquireLockResult);
    client?.addEventListener('onReleaseLockResult', onReleaseLockResult);
    client?.addEventListener('onRevokeLockResult', onRevokeLockResult);
    client?.addEventListener('onRemoveLockResult', onRemoveLockResult);
    client?.addEventListener('onGetLocksResult', onGetLocksResult);

    return () => {
      client.removeEventListener('onSubscribeResult', onSubscribeResult);
      client.removeEventListener('onSetLockResult', onSetLockResult);
      client?.removeEventListener('onAcquireLockResult', onAcquireLockResult);
      client?.removeEventListener('onReleaseLockResult', onReleaseLockResult);
      client?.removeEventListener('onRevokeLockResult', onRevokeLockResult);
      client?.removeEventListener('onRemoveLockResult', onRemoveLockResult);
      client?.removeEventListener('onGetLocksResult', onGetLocksResult);
    };
  }, [
    client,
    uid,
    onSubscribeResult,
    onSetLockResult,
    onAcquireLockResult,
    onReleaseLockResult,
    onRevokeLockResult,
    onRemoveLockResult,
    onGetLocksResult,
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
            setLockName(text);
          }}
          label="lock name"
          value={lockName}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (!text) return;
            setTtl(parseInt(text, 10));
          }}
          numberKeyboard
          label="ttl"
          value={ttl.toString()}
        />
        <AgoraButton
          title={`setLock`}
          disabled={!loginSuccess}
          onPress={() => {
            setLock();
          }}
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
        <AgoraButton
          title={`releaseLock`}
          disabled={!loginSuccess}
          onPress={() => {
            releaseLock();
          }}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            setRevokeOwner(text);
          }}
          label="revoke lock owner"
          value={revokeOwner}
        />
        <AgoraButton
          title={`revokeLock`}
          disabled={!loginSuccess}
          onPress={() => {
            revokeLock();
          }}
        />
        <AgoraButton
          title={`removeLock`}
          disabled={!loginSuccess}
          onPress={() => {
            removeLock();
          }}
        />
        <AgoraButton
          title={`getLocks`}
          disabled={!loginSuccess}
          onPress={() => {
            getLocks();
          }}
        />
        <AgoraText>lockDetailList:</AgoraText>
        {lockDetailList.map((item) => {
          return (
            <AgoraText key={item.lockName}>{`${JSON.stringify(
              item
            )}`}</AgoraText>
          );
        })}
      </ScrollView>
    </>
  );
}
