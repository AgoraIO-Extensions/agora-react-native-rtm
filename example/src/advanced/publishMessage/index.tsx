import { Buffer } from 'buffer';

import {
  LockEvent,
  MessageEvent,
  PresenceEvent,
  PublishOptions,
  RTM_CHANNEL_TYPE,
  RTM_MESSAGE_TYPE,
  StorageEvent,
  useRtm,
  useRtmEvent,
} from 'agora-react-native-rtm';
import React, { useCallback, useState } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

import BaseComponent from '../../components/BaseComponent';
import {
  AgoraButton,
  AgoraDivider,
  AgoraDropdown,
  AgoraStyle,
  AgoraView,
} from '../../components/ui';
import Config from '../../config/agora.config';
import { AgoraMessage } from '../../types';
import { enumToItems } from '../../utils';
import * as log from '../../utils/log';

export default function PublishMessage() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [publishMessageByBuffer, setPublishMessageByBuffer] = useState(false);
  const [cName, setCName] = useState<string>(Config.channelName);
  const [channelType, setChannelType] = useState<number>(
    RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE
  );
  const [uid] = useState<string>(Config.uid);
  const [messages, setMessages] = useState<AgoraMessage[]>([]);

  /**
   * Step 1: getRtmClient and initialize rtm client from BaseComponent
   */
  const client = useRtm();

  /**
   * Step 2 : publish message to message channel
   */
  const publish = useCallback(
    async (msg: AgoraMessage, msgs: AgoraMessage[]) => {
      try {
        if (publishMessageByBuffer) {
          await client.publish(
            cName,
            new Uint8Array(Buffer.from(msg.text)),
            new PublishOptions({
              channelType: channelType,
              messageType: RTM_MESSAGE_TYPE.RTM_MESSAGE_TYPE_BINARY,
            })
          );
        } else {
          await client.publish(
            cName,
            msg.text,
            new PublishOptions({
              channelType: channelType,
              messageType: RTM_MESSAGE_TYPE.RTM_MESSAGE_TYPE_STRING,
            })
          );
        }
        msg.sent = true;
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, msgs)
        );
      } catch (err) {
        msg.sent = false;
        log.error(`CHANNEL_INVALID_MESSAGE: ${err}`);
        return;
      }
    },
    [cName, client, publishMessageByBuffer, channelType]
  );

  const onSend = useCallback(
    (msgs: IMessage[] = []) => {
      if (!loginSuccess) {
        log.error('please login first');
        return;
      }

      msgs.forEach((message: IMessage) => {
        publish(message, msgs);
      });
    },
    [loginSuccess, publish]
  );

  /**
   * Step 3(optional) : subscribe message channel
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
   * Step 4 : unsubscribe message channel
   */
  const unsubscribe = async () => {
    try {
      await client.unsubscribe(cName);
      setSubscribeSuccess(false);
    } catch (status: any) {
      log.error('unsubscribe error', status);
    }
  };

  useRtmEvent(client, 'lock', (lock: LockEvent) => {
    log.info('lock', lock);
  });

  useRtmEvent(client, 'message', (message: MessageEvent) => {
    log.info('message', message);
    setMessages((prevState) =>
      GiftedChat.append(prevState, [
        {
          _id: +new Date(),
          text: message.message!,
          user: {
            _id: +new Date(),
            name: message.publisher || uid.slice(-1),
          },
          createdAt: new Date(),
        },
      ])
    );
  });

  useRtmEvent(client, 'presence', (presence: PresenceEvent) => {
    log.info('presence', presence);
  });

  useRtmEvent(client, 'storage', (storage: StorageEvent) => {
    log.info('storage', storage);
  });

  return (
    <>
      <AgoraView style={AgoraStyle.fullWidth}>
        <BaseComponent
          onChannelNameChanged={(v) => setCName(v)}
          onLoginStatusChanged={(status) => setLoginSuccess(status)}
        />
        <AgoraDivider />
        <AgoraDropdown
          items={enumToItems(RTM_CHANNEL_TYPE)}
          onValueChange={(v) => {
            setChannelType(v);
          }}
          title="select channelType"
          value={channelType}
        />
        <AgoraButton
          disabled={!loginSuccess}
          title={`${subscribeSuccess ? 'unsubscribe' : 'subscribe'}`}
          onPress={async () => {
            subscribeSuccess ? await unsubscribe() : await subscribe();
          }}
        />
      </AgoraView>
      <AgoraButton
        title={`current: publish${
          publishMessageByBuffer ? 'ByBuffer' : 'ByString'
        }`}
        onPress={() => {
          setPublishMessageByBuffer((v) => !v);
        }}
      />
      <GiftedChat
        wrapInSafeArea={false}
        messages={messages}
        onSend={(v) => onSend(v)}
        user={{
          _id: uid,
        }}
      />
    </>
  );
}
