import { TopicMessageOptions } from '../legacy/AgoraRtmBase';
import {
  JoinChannelOptions,
  JoinTopicOptions,
  TopicOptions,
} from '../legacy/IAgoraStreamChannel';

import { BaseResponse, ErrorInfo } from './RTMClient';

export type StreamChannelOperationResponse = (BaseResponse | ErrorInfo) & {
  topicName: string;
};

export type JoinChannelResponse = BaseResponse | ErrorInfo;

export type LeaveChannelResponse = JoinChannelResponse | ErrorInfo;

export type JoinTopicResponse = StreamChannelOperationResponse | ErrorInfo;

export type LeaveTopicResponse = JoinTopicResponse | ErrorInfo;

export type PublishTopicMessageResponse =
  | StreamChannelOperationResponse
  | ErrorInfo;

export type SubscribeTopicResponse = StreamChannelOperationResponse & {
  succeedUsers: string[];
  failedUsers: string[];
};

export type UnsubscribeTopicResponse = BaseResponse | ErrorInfo;

export type GetSubscribedUserListResponse = StreamChannelOperationResponse & {
  subscribed: string[];
};

export abstract class RTMStreamChannel {
  abstract join(options?: JoinChannelOptions): Promise<JoinChannelResponse>;
  abstract leave(): Promise<LeaveChannelResponse>;
  abstract joinTopic(
    topicName: string,
    options?: JoinTopicOptions
  ): Promise<JoinTopicResponse>;
  abstract publishTopicMessage(
    topicName: string,
    message: string | Uint8Array,
    options?: TopicMessageOptions
  ): Promise<PublishTopicMessageResponse>;
  abstract leaveTopic(topicName: string): Promise<LeaveTopicResponse>;
  abstract subscribeTopic(
    topicName: string,
    options?: TopicOptions
  ): Promise<SubscribeTopicResponse>;
  abstract unsubscribeTopic(
    topicName: string,
    options?: TopicOptions
  ): Promise<UnsubscribeTopicResponse>;
  abstract getSubscribedUserList(
    topicName: string
  ): Promise<GetSubscribedUserListResponse>;
  abstract release(): number;
}
