import { Buffer } from 'buffer';

import {
  IStreamChannel,
  JoinChannelOptions,
  JoinTopicOptions,
  MessageEvent,
  PublishOptions,
  RTM_CONNECTION_CHANGE_REASON,
  RTM_CONNECTION_STATE,
  RTM_ERROR_CODE,
  RTM_MESSAGE_TYPE,
  TopicEvent,
  UserList,
} from 'agora-react-native-rtm';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

import BaseComponent from '../../components/BaseComponent';
import {
  AgoraButton,
  AgoraStyle,
  AgoraTextInput,
  AgoraView,
} from '../../components/ui';
import Config from '../../config/agora.config';
import { useRtmClient } from '../../hooks/useRtmClient';
import * as log from '../../utils/log';

export default function PublishTopicMessage() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [joinTopicSuccess, setJoinTopicSuccess] = useState(false);
  const [publishMessageByBuffer, setPublishMessageByBuffer] = useState(false);
  const [streamChannel, setStreamChannel] = useState<IStreamChannel>();
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [cName, setCName] = useState<string>(Config.channelName);
  const [topicName, setTopicName] = useState<string>('topicRTMTest');
  const [uid, setUid] = useState<string>(Config.uid);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const onSubscribeTopicResult = useCallback(
    (
      requestId: number,
      channelName: string,
      userId: string,
      topic: string,
      succeedUsers: UserList,
      failedUsers: UserList,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.log(
        'onSubscribeTopicResult',
        'requestId',
        requestId,
        'channelName',
        channelName,
        'userId',
        userId,
        'topic',
        topic,
        'succeedUsers',
        succeedUsers,
        'failedUsers',
        failedUsers,
        'errorCode',
        errorCode
      );
      setSubscribeSuccess(errorCode === RTM_ERROR_CODE.RTM_ERROR_OK);
    },
    []
  );

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

  const onLeaveResult = useCallback(
    (
      requestId: number,
      channelName: string,
      userId: string,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.info(
        'onLeaveResult',
        'requestId',
        requestId,
        'channelName',
        channelName,
        'userId',
        userId,
        'errorCode',
        errorCode
      );
      setJoinSuccess(errorCode !== RTM_ERROR_CODE.RTM_ERROR_OK);
    },
    []
  );

  const onJoinTopicResult = useCallback(
    (
      requestId: number,
      channelName: string,
      userId: string,
      topic: string,
      meta: string,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.info(
        'onJoinTopicResult',
        'requestId',
        requestId,
        'channelName',
        channelName,
        'userId',
        userId,
        'topic',
        topic,
        'meta',
        meta,
        'errorCode',
        errorCode
      );
      setJoinTopicSuccess(errorCode === RTM_ERROR_CODE.RTM_ERROR_OK);
    },
    []
  );

  const onLeaveTopicResult = useCallback(
    (
      requestId: number,
      channelName: string,
      userId: string,
      topic: string,
      meta: string,
      errorCode: RTM_ERROR_CODE
    ) => {
      log.info(
        'onLeaveTopicResult',
        'requestId',
        requestId,
        'channelName',
        channelName,
        'userId',
        userId,
        'topic',
        topic,
        'meta',
        meta,
        'errorCode',
        errorCode
      );
      setJoinTopicSuccess(errorCode !== RTM_ERROR_CODE.RTM_ERROR_OK);
    },
    []
  );

  const onMessageEvent = useCallback(
    (event: MessageEvent) => {
      log.log('onMessageEvent', 'event', event);
      setMessages((prevState) =>
        GiftedChat.append(prevState, [
          {
            _id: +new Date(),
            text: event.message || '',
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

  const onTopicEvent = useCallback((event: TopicEvent) => {
    log.log('onTopicEvent', 'event', event);
  }, []);

  /**
   * Step 1: getRtmClient and initialize rtm client from BaseComponent
   */
  const client = useRtmClient();

  /**
   * Step 2 : publish message to topic by publishTopicMessage
   */
  const publish = useCallback(
    (msg: IMessage, msgs: any[]) => {
      let result: number | undefined;
      msg.sent = false;
      if (publishMessageByBuffer) {
        result = streamChannel?.publishTopicMessageWithBuffer(
          topicName,
          Buffer.from(msg.text),
          msg.text?.length,
          new PublishOptions({
            messageType: RTM_MESSAGE_TYPE.RTM_MESSAGE_TYPE_BINARY,
          })
        );
      } else {
        result = streamChannel?.publishTopicMessage(
          topicName,
          msg.text,
          msg.text?.length,
          new PublishOptions({
            messageType: RTM_MESSAGE_TYPE.RTM_MESSAGE_TYPE_STRING,
          })
        );
      }

      if (result !== RTM_ERROR_CODE.RTM_ERROR_OK) {
        log.error('publish topic message failed:', result);
      } else {
        msg.sent = true;
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, msgs)
        );
      }
    },
    [publishMessageByBuffer, streamChannel, topicName]
  );

  const onSend = useCallback(
    (msgs = []) => {
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
   * Step 3(optional) : subscribe topic
   */
  const subscribe = () => {
    streamChannel?.subscribeTopic(topicName, {});
  };

  /**
   * Step 4 : unsubscribe topic
   */
  const unsubscribe = () => {
    streamChannel?.unsubscribeTopic(topicName, {});
    setSubscribeSuccess(false);
  };

  /**
   * Step 2 : createStreamChannel
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
   * Step 3 : join message channel
   */
  const join = () => {
    if (!streamChannel) {
      log.error('please create streamChannel first');
      return;
    }
    streamChannel.join(new JoinChannelOptions({ token: Config.appId }));
  };

  /**
   * Step 4 : leave message channel
   */
  const leave = () => {
    if (streamChannel) {
      streamChannel.leave(0);
    }
  };

  /**
   * Step 3 : join topic
   */
  const joinTopic = () => {
    if (!streamChannel) {
      log.error('please create streamChannel first');
      return;
    }
    streamChannel.joinTopic(topicName, new JoinTopicOptions());
  };

  /**
   * Step 4 : leave topic
   */
  const leaveTopic = () => {
    if (streamChannel) {
      streamChannel.leaveTopic(topicName);
    }
  };

  /**
   * Step 5 : destroyStreamChannel
   */
  const destroyStreamChannel = useCallback(() => {
    streamChannel?.release();
    setStreamChannel(undefined);
  }, [streamChannel]);

  useEffect(() => {
    client.addEventListener('onJoinResult', onJoinResult);
    client.addEventListener('onLeaveResult', onLeaveResult);
    client.addEventListener('onSubscribeTopicResult', onSubscribeTopicResult);
    client.addEventListener('onMessageEvent', onMessageEvent);
    client.addEventListener('onTopicEvent', onTopicEvent);
    client.addEventListener('onJoinTopicResult', onJoinTopicResult);
    client.addEventListener('onLeaveTopicResult', onLeaveTopicResult);

    return () => {
      client.removeEventListener('onJoinResult', onJoinResult);
      client.removeEventListener('onLeaveResult', onLeaveResult);
      client.removeEventListener(
        'onSubscribeTopicResult',
        onSubscribeTopicResult
      );
      client.removeEventListener('onMessageEvent', onMessageEvent);
      client.removeEventListener('onTopicEvent', onTopicEvent);
      client.removeEventListener('onJoinTopicResult', onJoinTopicResult);
      client.removeEventListener('onLeaveTopicResult', onLeaveTopicResult);
    };
  }, [
    client,
    uid,
    onSubscribeTopicResult,
    onMessageEvent,
    onJoinResult,
    onLeaveResult,
    onTopicEvent,
    onJoinTopicResult,
    onLeaveTopicResult,
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
          setJoinTopicSuccess(false);
          setSubscribeSuccess(false);
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
      <AgoraView style={[AgoraStyle.fullSize]}>
        <ScrollView style={[{ maxHeight: '70%' }]}>
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
              setTopicName(text);
            }}
            placeholder="please input topic"
            label="topicName"
            value={topicName}
            disabled={joinTopicSuccess}
          />
          <AgoraButton
            disabled={!joinSuccess || !loginSuccess}
            title={`${joinTopicSuccess ? 'leave' : 'join'} topic`}
            onPress={() => {
              joinTopicSuccess ? leaveTopic() : joinTopic();
            }}
          />
          <AgoraButton
            disabled={!loginSuccess || !joinSuccess}
            title={`${subscribeSuccess ? 'unsubscribe' : 'subscribe'} topic`}
            onPress={() => {
              subscribeSuccess ? unsubscribe() : subscribe();
            }}
          />
          <AgoraButton
            title={`current: publish${
              publishMessageByBuffer ? 'ByBuffer' : 'ByString'
            }`}
            onPress={() => {
              setPublishMessageByBuffer((v) => !v);
            }}
          />
        </ScrollView>
        <GiftedChat
          wrapInSafeArea={false}
          messages={messages}
          onSend={(v) => onSend(v)}
          user={{
            _id: uid,
          }}
        />
      </AgoraView>
    </>
  );
}
