import { Buffer } from 'buffer';

import {
  MessageEvent,
  PublishOptions,
  RTM_CHANNEL_TYPE,
  RTM_CONNECTION_CHANGE_REASON,
  RTM_CONNECTION_STATE,
  RTM_ERROR_CODE,
  RTM_MESSAGE_TYPE,
  RTM_PROXY_TYPE,
  useRtm,
} from 'agora-react-native-rtm';
import React, { useCallback, useEffect, useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

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
  const [uid, setUid] = useState<string>(Config.uid);
  const [messages, setMessages] = useState<AgoraMessage[]>([]);

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

  const onPublishResult = useCallback(
    (requestId: number, errorCode: RTM_ERROR_CODE) => {
      log.log(
        'onPublishResult',
        'requestId',
        requestId,
        'errorCode',
        errorCode
      );
      if (errorCode !== RTM_ERROR_CODE.RTM_ERROR_OK) {
        log.error(`CHANNEL_INVALID_MESSAGE: ${errorCode}`);
      } else {
        messages.map((message) => {
          if (message.requestId === requestId) {
            message.sent = true;
          }
        });
      }
    },
    [messages]
  );

  const onMessageEvent = useCallback(
    (event: MessageEvent) => {
      log.log('onMessageEvent', 'event', event);
      setMessages((prevState) =>
        GiftedChat.append(prevState, [
          {
            _id: +new Date(),
            text: event.message!,
            user: {
              _id: +new Date(),
              name: event.publisher || uid.slice(-1),
            },
            createdAt: new Date(),
          },
        ])
      );
    },
    [uid]
  );

  /**
   * Step 1: getRtmClient and initialize rtm client from BaseComponent
   */
  const client = useRtm();

  /**
   * Step 2 : publish message to message channel
   */
  const publish = useCallback(
    (msg: AgoraMessage, msgs: AgoraMessage[]) => {
      try {
        if (publishMessageByBuffer) {
          msg.requestId = client.publishWithBuffer(
            cName,
            Buffer.from(msg.text),
            msg.text?.length,
            new PublishOptions({
              channelType: channelType,
              messageType: RTM_MESSAGE_TYPE.RTM_MESSAGE_TYPE_BINARY,
            })
          );
        } else {
          msg.requestId = client.publish(
            cName,
            msg.text,
            msg.text?.length,
            new PublishOptions({
              channelType: channelType,
              messageType: RTM_MESSAGE_TYPE.RTM_MESSAGE_TYPE_STRING,
            })
          );
        }
        msg.sent = false;
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, msgs)
        );
      } catch (err) {
        log.error(err);
        return;
      }
    },
    [cName, client, publishMessageByBuffer, channelType]
  );

  const onSend = useCallback(
    (msgs = []) => {
      if (!loginSuccess) {
        log.error('please login first');
        return;
      }

      msgs.forEach((message: AgoraMessage) => {
        publish(message, msgs);
      });
    },
    [loginSuccess, publish]
  );

  /**
   * Step 3(optional) : subscribe message channel
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
   * Step 4 : unsubscribe message channel
   */
  const unsubscribe = () => {
    client.unsubscribe(cName);
    setSubscribeSuccess(false);
  };

  useEffect(() => {
    client.addEventListener('onSubscribeResult', onSubscribeResult);
    client.addEventListener('onMessageEvent', onMessageEvent);
    client.addEventListener('onPublishResult', onPublishResult);

    return () => {
      client.removeEventListener('onSubscribeResult', onSubscribeResult);
      client.removeEventListener('onMessageEvent', onMessageEvent);
      client.removeEventListener('onPublishResult', onPublishResult);
    };
  }, [client, uid, onSubscribeResult, onMessageEvent, onPublishResult]);

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
      <AgoraView style={AgoraStyle.fullWidth}>
        <BaseComponent
          onChannelNameChanged={(v) => setCName(v)}
          onUidChanged={(v) => setUid(v)}
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
          onPress={() => {
            subscribeSuccess ? unsubscribe() : subscribe();
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
