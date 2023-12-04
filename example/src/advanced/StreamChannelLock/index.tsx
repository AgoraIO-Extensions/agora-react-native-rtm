import {
  IStreamChannel,
  JoinChannelOptions,
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
  AgoraText,
  AgoraTextInput,
} from '../../components/ui';
import Config from '../../config/agora.config';
import { useRtmClient } from '../../hooks/useRtmClient';
import * as log from '../../utils/log';

export default function StreamChannelLock() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [streamChannel, setStreamChannel] = useState<IStreamChannel>();
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

  const onJoinResult = useCallback(
    (
      requestId: number,
      channelName: string,
      userId: string,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.info(
        'onJoinResult',
        'requestId',
        requestId,
        'channelName',
        channelName,
        'userId',
        userId,
        'errorCode',
        errorCode
      );
      setJoinSuccess(errorCode === RTM_ERROR_CODE.RTM_ERROR_OK);
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
  const join = () => {
    if (!streamChannel) {
      log.error('please create streamChannel first');
      return;
    }
    streamChannel.join(
      new JoinChannelOptions({ token: Config.appId, withMetadata: true })
    );
  };

  /**
   * Step 1-3 : leave message channel
   */
  const leave = () => {
    if (streamChannel) {
      streamChannel.leave(0);
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
   * Step 1-4 : getLocks
   */
  const getLocks = () => {
    getLocksRequestId.current = client
      .getLock()
      .getLocks(cName, RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM);
  };

  /**
   * Step 2 : setLock
   */
  const setLock = () => {
    setLockRequestId.current = client
      .getLock()
      .setLock(cName, RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM, lockName, ttl);
  };

  /**
   * Step 3 : acquireLock
   */
  const acquireLock = () => {
    acquireLockRequestId.current = client
      .getLock()
      .acquireLock(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM,
        lockName,
        false
      );
  };

  /**
   * Step 4 : releaseLock
   */
  const releaseLock = () => {
    releaseLockRequestId.current = client
      .getLock()
      .releaseLock(cName, RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM, lockName);
  };

  /**
   * Step 5 : revokeLock
   */
  const revokeLock = () => {
    revokeLockRequestId.current = client
      .getLock()
      .revokeLock(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM,
        lockName,
        uid
      );
  };

  /**
   * Step 5 : removeLock
   */
  const removeLock = () => {
    removeLockRequestId.current = client
      .getLock()
      .removeLock(cName, RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM, lockName);
  };

  useEffect(() => {
    client.addEventListener('onJoinResult', onJoinResult);
    client.addEventListener('onSetLockResult', onSetLockResult);
    client?.addEventListener('onAcquireLockResult', onAcquireLockResult);
    client?.addEventListener('onReleaseLockResult', onReleaseLockResult);
    client?.addEventListener('onRevokeLockResult', onRevokeLockResult);
    client?.addEventListener('onRemoveLockResult', onRemoveLockResult);
    client?.addEventListener('onGetLocksResult', onGetLocksResult);

    return () => {
      client.removeEventListener('onJoinResult', onJoinResult);
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
    onJoinResult,
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
            destroyStreamChannel();
          }
          setJoinSuccess(false);
          break;
      }
    },
    [destroyStreamChannel]
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
