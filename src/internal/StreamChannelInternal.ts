import {
  GetSubscribedUserListResponse,
  JoinChannelResponse,
  JoinTopicResponse,
  LeaveChannelResponse,
  LeaveTopicResponse,
  PublishTopicMessageOptions,
  PublishTopicMessageResponse,
  SubscribeTopicResponse,
  UnsubscribeTopicResponse,
  joinTopicOptions,
} from '../api/RTMStreamChannel';
import { TopicOptions } from '../legacy/IAgoraStreamChannel';
import { JoinChannelOptions } from '../legacy/IAgoraStreamChannel';
import { IStreamChannelImpl } from '../legacy/impl/IAgoraStreamChannelImpl';

import { handleError, wrapRtmResult } from './IrisRtmEngine';

export class StreamChannelInternal extends IStreamChannelImpl {
  private readonly _channelName: string = '';

  constructor(channelName: string) {
    super();
    console.log('create streamChannel', channelName);
    this._channelName = channelName;
  }

  get channelName(): string {
    return this._channelName;
  }

  join(options: JoinChannelOptions): Promise<JoinChannelResponse> {
    let operation = 'join';
    let callBack = 'onJoinResult';
    try {
      const status = super.join(options);
      return wrapRtmResult(status, operation, callBack);
    } catch (error) {
      throw handleError(error, operation);
    }
  }

  leave(): Promise<LeaveChannelResponse> {
    let operation = 'leave';
    let callBack = 'onLeaveResult';
    try {
      const status = super.leave();
      return wrapRtmResult(status, operation, callBack);
    } catch (error) {
      throw handleError(error, operation);
    }
  }

  joinTopic(
    topicName: string,
    options?: joinTopicOptions
  ): Promise<JoinTopicResponse> {
    let operation = 'joinTopic';
    let callBack = 'onJoinTopicResult';
    try {
      const status = super.joinTopic(topicName, options!);
      return wrapRtmResult(
        status,
        operation,
        callBack
      ) as Promise<JoinTopicResponse>;
    } catch (error) {
      throw handleError(error, operation);
    }
  }

  publishTopicMessage(
    topicName: string,
    message: string | Uint8Array,
    options?: PublishTopicMessageOptions
  ): Promise<PublishTopicMessageResponse> {
    let operation = 'publishTopicMessage';
    let callBack = 'onPublishTopicMessageResult';
    try {
      const status = super.publishTopicMessage(topicName, message, options!);
      return wrapRtmResult(
        status,
        operation,
        callBack
      ) as Promise<PublishTopicMessageResponse>;
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  leaveTopic(topicName: string): Promise<LeaveTopicResponse> {
    let operation = 'leaveTopic';
    let callBack = 'onLeaveTopicResult';
    try {
      const status = super.leaveTopic(topicName);
      return wrapRtmResult(
        status,
        operation,
        callBack
      ) as Promise<LeaveTopicResponse>;
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  subscribeTopic(
    topicName: string,
    options?: TopicOptions
  ): Promise<SubscribeTopicResponse> {
    let operation = 'subscribeTopic';
    let callBack = 'onSubscribeTopicResult';
    try {
      if (!options) {
        options = {};
      }
      const status = super.subscribeTopic(topicName, options!);
      return wrapRtmResult(
        status,
        operation,
        callBack
      ) as Promise<SubscribeTopicResponse>;
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  unsubscribeTopic(
    topicName: string,
    options?: TopicOptions
  ): Promise<UnsubscribeTopicResponse> {
    let operation = 'unsubscribeTopic';
    let callBack = 'onUnsubscribeTopicResult';
    try {
      const status = super.unsubscribeTopic(topicName, options!);
      return wrapRtmResult(
        status,
        operation,
        callBack
      ) as Promise<UnsubscribeTopicResponse>;
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  getSubscribedUserList(
    topicName: string
  ): Promise<GetSubscribedUserListResponse> {
    throw new Error('Method not implemented.');
  }

  release(): number {
    const ret = super.release();
    return ret;
  }
}
