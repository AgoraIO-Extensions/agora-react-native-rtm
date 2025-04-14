import {
  GetSubscribedUserListResponse,
  JoinChannelResponse,
  JoinTopicResponse,
  LeaveChannelResponse,
  LeaveTopicResponse,
  PublishTopicMessageOptions,
  PublishTopicMessageResponse,
  RTMStreamChannel,
  SubscribeTopicOptions,
  SubscribeTopicResponse,
  UnsubscribeTopicOptions,
  UnsubscribeTopicResponse,
  joinTopicOptions,
} from '../api/RTMStreamChannel';
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
    throw new Error('Method not implemented.');
  }
  publishTopicMessage(
    topicName: string,
    message: string | Uint8Array,
    options?: PublishTopicMessageOptions
  ): Promise<PublishTopicMessageResponse> {
    throw new Error('Method not implemented.');
  }
  leaveTopic(topicName: string): Promise<LeaveTopicResponse> {
    throw new Error('Method not implemented.');
  }
  subscribeTopic(
    topicName: string,
    options?: SubscribeTopicOptions
  ): Promise<SubscribeTopicResponse> {
    throw new Error('Method not implemented.');
  }
  unsubscribeTopic(
    topicName: string,
    options?: UnsubscribeTopicOptions
  ): Promise<UnsubscribeTopicResponse> {
    throw new Error('Method not implemented.');
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
