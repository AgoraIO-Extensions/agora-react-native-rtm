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
  AgoraStyle,
  AgoraText,
  AgoraTextInput,
} from '../../components/ui';
import Config from '../../config/agora.config';
import * as log from '../../utils/log';

export default function StreamChannelLock() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [streamChannel, setStreamChannel] = useState<RTMStreamChannel>();
  const [cName, setCName] = useState<string>(Config.channelName);
  const [uid] = useState<string>(Config.uid);
  const [lockDetailList, setLockDetailList] = useState<LockDetail[]>([]);

  const [lockName, setLockName] = useState<string>('lock-test');
  const [ttl, setTtl] = useState<number>(10);

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
    log.info('createStreamChannel success', result);
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
      let result = await streamChannel.join(
        new JoinChannelOptions({
          token: Config.appId,
        })
      );
      setJoinSuccess(true);
      log.info('join success', result);
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
      let result = await streamChannel.leave();
      setJoinSuccess(false);
      log.info('leave success', result);
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
    log.info('destroyStreamChannel success');
  }, [streamChannel]);

  /**
   * Step 1-4 : getLocks
   */
  const getLocks = async () => {
    try {
      let result = await client.lock.getLock(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM
      );
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
      let result = await client.lock.setLock(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM,
        lockName,
        { ttl }
      );
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
      let result = await client.lock.acquireLock(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM,
        lockName,
        { retry: false }
      );
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
      let result = await client.lock.releaseLock(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM,
        lockName
      );
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
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM,
        lockName,
        uid
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
      let result = await client.lock.removeLock(
        cName,
        RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_STREAM,
        lockName
      );
      log.info('removeLock success', result);
    } catch (status: any) {
      log.error('removeLock error', status);
    }
  };

  const handleLoginStatus = useCallback((status: boolean) => {
    setLoginSuccess(status);
    if (!status) {
      setStreamChannel(undefined);
      setJoinSuccess(false);
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
          onPress={async () => {
            await setLock();
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
