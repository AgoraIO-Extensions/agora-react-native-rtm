import {
  JoinChannelOptions,
  LockDetail,
  RTMStreamChannel,
  RTM_CHANNEL_TYPE,
  useRtm,
} from 'agora-react-native-rtm';
import React, { useCallback, useState } from 'react';

import { ScrollView } from 'react-native';

import BaseComponent from '../../components/BaseComponent';
import {
  AgoraButton,
  AgoraDivider,
  AgoraDropdown,
  AgoraStyle,
  AgoraSwitch,
  AgoraText,
  AgoraTextInput,
} from '../../components/ui';
import Config from '../../config/agora.config';
import { enumToItems } from '../../utils';
import * as log from '../../utils/log';

export default function Lock() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [streamChannel, setStreamChannel] = useState<RTMStreamChannel>();
  const [channelType, setChannelType] = useState<number>(
    RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE
  );
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [cName, setCName] = useState<string>(Config.channelName);
  const [uid] = useState<string>(Config.uid);
  const [lockDetailList, setLockDetailList] = useState<LockDetail[]>([]);

  const [lockName, setLockName] = useState<string>('lock-test');
  const [ttl, setTtl] = useState<number>(10);
  const [retry, setRetry] = useState<boolean>(false);
  const [revokeOwner, setRevokeOwner] = useState<string>('');

  const [withMessage, setWithMessage] = useState<boolean>(true);
  const [withMetadata, setWithMetadata] = useState<boolean>(true);
  const [withPresence, setWithPresence] = useState<boolean>(true);
  const [withLock, setWithLock] = useState<boolean>(true);

  /**
   * Step 1: getRtmClient and initialize rtm client from BaseComponent
   */
  const client = useRtm();

  /**
   * createStreamChannel
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
   * Step 1-3 : getLocks
   */
  const getLocks = async () => {
    try {
      let result = await client.lock.getLock(cName, channelType);
      setLockDetailList(result.lockDetails);
      log.info('getLocks success', result);
    } catch (status: any) {
      log.error('getLocks error', status);
    }
  };

  /**
   * Step 2 : setLock
   */
  const setLock = async () => {
    try {
      let result = await client.lock.setLock(cName, channelType, lockName, {
        ttl,
      });
      log.info('setLock success', result);
    } catch (status: any) {
      log.error('setLock error', status);
    }
  };

  /**
   * Step 3 : acquireLock
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
   * Step 4 : releaseLock
   */
  const releaseLock = async () => {
    try {
      let result = await client.lock.releaseLock(cName, channelType, lockName);
      log.info('releaseLock success', result);
    } catch (status: any) {
      log.error('releaseLock error', status);
    }
  };

  /**
   * Step 5 : revokeLock
   */
  const revokeLock = async () => {
    try {
      let result = await client.lock.revokeLock(
        cName,
        channelType,
        lockName,
        revokeOwner
      );
      log.info('revokeLock success', result);
    } catch (status: any) {
      log.error('revokeLock error', status);
    }
  };

  /**
   * Step 5 : removeLock
   */
  const removeLock = async () => {
    try {
      let result = await client.lock.removeLock(cName, channelType, lockName);
      log.info('removeLock success', result);
    } catch (status: any) {
      log.error('removeLock error', status);
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
          onPress={async () => {
            await acquireLock();
          }}
        />
        <AgoraButton
          title={`releaseLock`}
          disabled={!loginSuccess}
          onPress={async () => {
            await releaseLock();
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
          onPress={async () => {
            await revokeLock();
          }}
        />
        <AgoraButton
          title={`removeLock`}
          disabled={!loginSuccess}
          onPress={async () => {
            await removeLock();
          }}
        />
        <AgoraButton
          title={`getLocks`}
          disabled={!loginSuccess}
          onPress={async () => {
            await getLocks();
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
