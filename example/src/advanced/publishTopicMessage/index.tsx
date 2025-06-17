import { Buffer } from 'buffer';

import {
  JoinChannelOptions,
  JoinTopicOptions,
  MessageEvent,
  RTMStreamChannel,
  RtmMessageType,
  TopicMessageOptions,
  useRtm,
} from 'agora-react-native-rtm';
import React, { useCallback, useState } from 'react';
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
import * as log from '../../utils/log';

export default function PublishTopicMessage() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [joinTopicSuccess, setJoinTopicSuccess] = useState(false);
  const [publishMessageByBuffer, setPublishMessageByBuffer] = useState(false);
  const [streamChannel, setStreamChannel] = useState<RTMStreamChannel>();
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [cName, setCName] = useState<string>(Config.channelName);
  const [topicName, setTopicName] = useState<string>('topicRTMTest');
  const [uid] = useState<string>(Config.uid);
  const [messages, setMessages] = useState<IMessage[]>([]);

  /**
   * Step 1: getRtmClient and initialize rtm client from BaseComponent
   */
  const client = useRtm();

  /**
   * Step 2 : publish message to topic by publishTopicMessage
   */
  const publish = useCallback(
    async (msg: IMessage, msgs: any[]) => {
      try {
        if (publishMessageByBuffer) {
          let result = await streamChannel?.publishTopicMessage(
            topicName,
            new Uint8Array(Buffer.from(msg.text)),
            new TopicMessageOptions({
              messageType: RtmMessageType.binary,
            })
          );
          log.info('publish topic message success', result);
        } else {
          let result = await streamChannel?.publishTopicMessage(
            topicName,
            msg.text,
            new TopicMessageOptions({
              messageType: RtmMessageType.string,
            })
          );
          log.info('publish topic message success', result);
        }

        msg.sent = true;
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, msgs)
        );
      } catch (error) {
        msg.sent = false;
        log.error('publish topic message failed:', error);
      }
    },
    [publishMessageByBuffer, streamChannel, topicName]
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
   * Step 3(optional) : subscribe topic
   */
  const subscribe = async () => {
    try {
      let result = await streamChannel?.subscribeTopic(topicName);
      log.info('subscribe success', result);
      setSubscribeSuccess(true);
    } catch (status: any) {
      log.error('subscribe error', status);
    }
  };

  /**
   * Step 4 : unsubscribe topic
   */
  const unsubscribe = async () => {
    try {
      let result = await streamChannel?.unsubscribeTopic(topicName);
      log.info('unsubscribe success', result);
      setSubscribeSuccess(false);
    } catch (status: any) {
      log.error('unsubscribe error', status);
    }
  };

  /**
   * Step 2 : createStreamChannel
   */
  const createStreamChannel = async () => {
    if (joinSuccess) {
      log.error('already joined channel');
      return;
    }
    try {
      let result = await client.createStreamChannel(cName);
      setStreamChannel(result);
      log.info('createStreamChannel success', result);
    } catch (status: any) {
      log.error('createStreamChannel error', status);
    }
  };

  /**
   * Step 3 : join message channel
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
      log.info('join success', result);
      setJoinSuccess(true);
    } catch (status: any) {
      log.error('join error', status);
    }
  };

  /**
   * Step 4 : leave message channel
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
   * Step 3 : join topic
   */
  const joinTopic = async () => {
    try {
      if (!streamChannel) {
        log.error('please create streamChannel first');
        return;
      }
      let result = await streamChannel.joinTopic(
        topicName,
        new JoinTopicOptions()
      );
      setJoinTopicSuccess(true);
      log.info('join topic success', result);
    } catch (status: any) {
      log.error('join topic error', status);
    }
  };

  /**
   * Step 4 : leave topic
   */
  const leaveTopic = async () => {
    try {
      if (!streamChannel) {
        log.error('please create streamChannel first');
        return;
      }
      let result = await streamChannel.leaveTopic(topicName);
      setJoinTopicSuccess(false);
      log.info('leave topic success', result);
    } catch (status: any) {
      log.error('leave topic error', status);
    }
  };

  /**
   * Step 5 : destroyStreamChannel
   */
  const destroyStreamChannel = useCallback(() => {
    streamChannel?.release();
    setStreamChannel(undefined);
    log.info('destroyStreamChannel success');
  }, [streamChannel]);

  /**
   * Step 6 : getSubscribedUserList
   */
  const getSubscribedUserList = async () => {
    try {
      const result = await streamChannel?.getSubscribedUserList(topicName);
      log.info('getSubscribedUserList success', result);
    } catch (status: any) {
      log.error('getSubscribedUserList error', status);
    }
  };

  const handleMessage = (message: MessageEvent) => {
    log.info('message', message);
    setMessages((prevState) =>
      GiftedChat.append(prevState, [
        {
          _id: +new Date(),
          text: message.message || '',
          user: {
            _id: +new Date(),
            name: message.publisher || uid.slice(-1),
          },
          createdAt: new Date(),
        },
      ])
    );
  };

  const handleLoginStatus = useCallback((status: boolean) => {
    setLoginSuccess(status);
    if (!status) {
      setStreamChannel(undefined);
      setJoinSuccess(false);
      setJoinTopicSuccess(false);
      setSubscribeSuccess(false);
    }
  }, []);

  return (
    <>
      <AgoraView style={[AgoraStyle.fullSize]}>
        <ScrollView style={[{ maxHeight: '70%' }]}>
          <BaseComponent
            onChannelNameChanged={(v) => setCName(v)}
            onLoginStatusChanged={handleLoginStatus}
            onMessage={handleMessage}
          />
          <AgoraButton
            disabled={!loginSuccess}
            title={`${
              streamChannel ? 'destroyStreamChannel' : 'createStreamChannel'
            }`}
            onPress={async () => {
              streamChannel
                ? destroyStreamChannel()
                : await createStreamChannel();
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
            onPress={async () => {
              joinTopicSuccess ? await leaveTopic() : await joinTopic();
            }}
          />
          <AgoraButton
            disabled={!loginSuccess || !joinSuccess}
            title={`${subscribeSuccess ? 'unsubscribe' : 'subscribe'} topic`}
            onPress={async () => {
              subscribeSuccess ? await unsubscribe() : await subscribe();
            }}
          />
          <AgoraButton
            disabled={!loginSuccess || !joinSuccess}
            title={`getSubscribedUserList`}
            onPress={async () => {
              await getSubscribedUserList();
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
