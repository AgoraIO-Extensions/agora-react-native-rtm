import { LockDetail, RTM_CHANNEL_TYPE, useRtm } from 'agora-react-native-rtm';
import React, { useCallback, useState } from 'react';

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
import * as log from '../../utils/log';

export default function Lock() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [cName, setCName] = useState<string>(Config.channelName);
  const [uid] = useState<string>(Config.uid);
  const [lockDetailList, setLockDetailList] = useState<LockDetail[]>([]);

  const [lockName, setLockName] = useState<string>('lock-test');
  const [ttl, setTtl] = useState<number>(10);
  const [retry, setRetry] = useState<boolean>(false);
  const [revokeOwner, setRevokeOwner] = useState<string>('');

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
   * Step 1-3 : getLocks
   */
  const getLocks = async () => {
    try {
      let result = await client.lock.getLock(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE
      );
      setLockDetailList(result.lockDetails);
      log.alert(`${uid} locks:`, `${JSON.stringify(result)}`);
    } catch (status: any) {
      log.error('getLocks error', status);
    }
  };

  /**
   * Step 2 : setLock
   */
  const setLock = async () => {
    try {
      let result = await client.lock.setLock(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
        lockName,
        { ttl }
      );
      log.alert(`${uid} setLock:`, `${JSON.stringify(result)}`);
    } catch (status: any) {
      log.error('setLock error', status);
    }
  };

  /**
   * Step 3 : acquireLock
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
   * Step 4 : releaseLock
   */
  const releaseLock = async () => {
    try {
      let result = await client.lock.releaseLock(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
        lockName
      );
      log.alert(`${uid} releaseLock:`, `${JSON.stringify(result)}`);
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
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
        lockName,
        revokeOwner
      );
      log.alert(`${uid} revokeLock:`, `${JSON.stringify(result)}`);
    } catch (status: any) {
      log.error('revokeLock error', status);
    }
  };

  /**
   * Step 5 : removeLock
   */
  const removeLock = async () => {
    try {
      let result = await client.lock.removeLock(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE,
        lockName
      );
      log.alert(`${uid} removeLock:`, `${JSON.stringify(result)}`);
    } catch (status: any) {
      log.error('removeLock error', status);
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
          onPress={async () => {
            subscribeSuccess ? await unsubscribe() : await subscribe();
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
