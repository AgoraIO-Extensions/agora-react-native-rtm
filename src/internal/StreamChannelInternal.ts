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

  async joinTopic(
    topicName: string,
    options?: joinTopicOptions
  ): Promise<JoinTopicResponse> {
    let operation = 'joinTopic';
    let callBack = 'onJoinTopicResult';
    try {
      const status = super.joinTopic(topicName, options!);
      let result = await wrapRtmResult(status, operation, callBack);
      return {
        ...result,
        topicName,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }

  async publishTopicMessage(
    topicName: string,
    message: string | Uint8Array,
    options?: PublishTopicMessageOptions
  ): Promise<PublishTopicMessageResponse> {
    let operation = 'publishTopicMessage';
    let callBack = 'onPublishTopicMessageResult';
    try {
      const status = super.publishTopicMessage(topicName, message, options!);
      let result = await wrapRtmResult(status, operation, callBack);
      return {
        ...result,
        topicName,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async leaveTopic(topicName: string): Promise<LeaveTopicResponse> {
    let operation = 'leaveTopic';
    let callBack = 'onLeaveTopicResult';
    try {
      const status = super.leaveTopic(topicName);
      let result = await wrapRtmResult(status, operation, callBack);
      return {
        ...result,
        topicName,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async subscribeTopic(
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
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        succeedUsers: result.callBackResult?.succeedUsers,
        failedUsers: result.callBackResult?.failedUsers,
        timestamp: result.timestamp,
        topicName,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async unsubscribeTopic(
    topicName: string,
    options?: TopicOptions
  ): Promise<UnsubscribeTopicResponse> {
    let operation = 'unsubscribeTopic';
    let callBack = 'onUnsubscribeTopicResult';
    try {
      const status = super.unsubscribeTopic(topicName, options!);
      let result = await wrapRtmResult(status, operation, callBack);
      return result;
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async getSubscribedUserList(
    topicName: string
  ): Promise<GetSubscribedUserListResponse> {
    let operation = 'getSubscribedUserList';
    let callBack = 'onGetSubscribedUserListResult';
    try {
      const status = super.getSubscribedUserList(topicName, 0);
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        subscribed: result.callBackResult?.users,
        topicName,
        timestamp: result.timestamp,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  release(): number {
    const ret = super.release();
    return ret;
  }
}
