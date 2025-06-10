import {
  GetSubscribedUserListResponse,
  JoinChannelResponse,
  JoinTopicResponse,
  LeaveChannelResponse,
  LeaveTopicResponse,
  PublishTopicMessageResponse,
  SubscribeTopicResponse,
  UnsubscribeTopicResponse,
} from '../api/RTMStreamChannel';
import { TopicMessageOptions } from '../legacy/AgoraRtmBase';
import { JoinTopicOptions, TopicOptions } from '../legacy/IAgoraStreamChannel';
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
    options?: JoinTopicOptions
  ): Promise<JoinTopicResponse> {
    let operation = 'joinTopic';
    let callBack = 'onJoinTopicResult';
    try {
      const status = super.joinTopic(
        topicName,
        options ? options : new JoinTopicOptions()
      );
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
    options?: TopicMessageOptions
  ): Promise<PublishTopicMessageResponse> {
    let operation = 'publishTopicMessage';
    let callBack = 'onPublishTopicMessageResult';
    try {
      const status = super.publishTopicMessage(
        topicName,
        message,
        options ? options : new TopicMessageOptions()
      );
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
      const status = super.subscribeTopic(
        topicName,
        options ? options : new TopicOptions()
      );
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
      const status = super.unsubscribeTopic(
        topicName,
        options ? options : new TopicOptions()
      );
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
