import { TopicMessageOptions } from '../legacy/AgoraRtmBase';
import {
  JoinChannelOptions,
  JoinTopicOptions,
  TopicOptions,
} from '../legacy/IAgoraStreamChannel';

import { ErrorInfo } from './RTMClient';

import { BaseResponse } from './common';

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

export const enum SubscribeTopicErrorCode {
  NO_ERROR = 0,
  PARTIALLY_SUCCESSFUL = 1,
  ALL_FAILED = 2,
  UNKNOWN_ERROR = 3,
  INVALID_PARAMS = 4,
  REMOTE_USER_IS_NOT_PUBLISHED = 5,
  INVALID_REMOTE_USER = 6,
  TIMEOUT = 7,

  ALREADY_SUBSCRIBED_USER = 20001,

  SUB_USER_EXCEED_LIMITATION = 20003,

  NOT_SUBSCRIBED_USER = 20004,
}

export type SubscribeTopicResponse = StreamChannelOperationResponse & {
  succeedUsers: string[];
  failedUsers: string[];
};

export type UnsubscribeTopicResponse = BaseResponse | ErrorInfo;

export type GetSubscribedUserListResponse = StreamChannelOperationResponse & {
  subscribed: string[];
};

export interface JoinOptions {
  token?: string;
  withPresence?: boolean;

  beQuiet?: boolean;
  withMetadata?: boolean;
  withLock?: boolean;
}

export interface joinTopicOptions {
  meta?: any;
}

export interface PublishTopicMessageOptions {
  customType?: string;
}

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
