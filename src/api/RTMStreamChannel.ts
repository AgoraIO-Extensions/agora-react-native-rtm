import { TopicMessageOptions } from '../legacy/AgoraRtmBase';

import { TopicOptions } from '../legacy/IAgoraStreamChannel';

import { ErrorInfo } from './RTMClient';

import { BaseResponse } from './common';

export interface StreamChannelOperationResponse extends BaseResponse {
  topicName: string;
}

export type JoinChannelResponse = BaseResponse | ErrorInfo;

export type LeaveChannelResponse = JoinChannelResponse | ErrorInfo;

export type JoinTopicResponse = StreamChannelOperationResponse | ErrorInfo;

export type LeaveTopicResponse = JoinTopicResponse | ErrorInfo;

export type PublishTopicMessageResponse =
  | StreamChannelOperationResponse
  | ErrorInfo;

export namespace RTMStreamChannelStatusCode {
  export const enum SubscribeTopicErrorCode {
    // 全部成功
    NO_ERROR = 0,
    // 部分成功
    PARTIALLY_SUCCESSFUL = 1,
    // 全部失败
    ALL_FAILED = 2,
    UNKNOWN_ERROR = 3,
    INVALID_PARAMS = 4,
    // dc 不存在
    REMOTE_USER_IS_NOT_PUBLISHED = 5,
    // 用户不存在
    INVALID_REMOTE_USER = 6,
    TIMEOUT = 7,

    // 已经订阅过这个 user
    ALREADY_SUBSCRIBED_USER = 20001,

    // 订阅同一个 topic 下 user 超出限制
    SUB_USER_EXCEED_LIMITATION = 20003,

    // 没有订阅这个用户
    NOT_SUBSCRIBED_USER = 20004,
  }
}

export interface SubscribedFailedReason extends StreamChannelOperationResponse {
  /**@zh-cn
   * 订阅/退订 topic 里的用户失败。
   */
  /**
   * Failed to subscribe/unsubscribe users in topic.
   */
  user: string;

  /**@zh-cn
   * 操作对应的错误码。
   */
  /**
   * Error code of the operation. See {@link RTMStreamChannelStatusCode.SubscribeTopicErrorCode}
   */

  errorCode?: RTMStreamChannelStatusCode.SubscribeTopicErrorCode;
  /**@zh-cn
   * 失败原因。
   */
  /**
   * The failure reason.
   */
  reason?: string;
}

export interface SubscribeTopicResponse extends StreamChannelOperationResponse {
  /**@zh-cn
   * 订阅成功的用户列表。
   */
  /**
   * List of successfully subscribed users.
   */
  succeedUsers: string[];

  /**@zh-cn
   * 订阅失败的用户列表及错误码。
   */
  /**
   * List of users whose subscription failed and error codes. See {@link SubscribedFailedReason}
   */
  failedUsers: string[];

  failedDetails: SubscribedFailedReason[];
  // failed:string[] ++details\
  // channelName ,topicName 给出
}

export interface UnsubscribeTopicResponse extends BaseResponse {}

export interface GetSubscribedUserListResponse
  extends StreamChannelOperationResponse {
  /**@zh-cn
   * 已经订阅的用户列表。
   */
  /**
   * List of subscribed users.
   */
  subscribed: string[];
}

export interface JoinOptions {
  token?: string;
  // 订阅他人的 presence 事件，默认 true；remote-join/remote-leave/remote-timeout收不到
  withPresence?: boolean;

  /**@zh-cn
   * 可选参数，是否隐身加入频道。默认值为 false
   */
  /**
   * Optional parameter, whether subscribe channel be quiet, The default value is false. @default false
   */
  beQuiet?: boolean;
  withMetadata?: boolean;
  withLock?: boolean;
}

export interface joinTopicOptions {
  meta?: any;
}

export interface PublishTopicMessageOptions {
  /**@zh-cn
   * 自定义消息负载结构
   */
  /**
   * type of message payload
   */
  customType?: string;
}

export abstract class RTMStreamChannel {
  abstract join(options?: JoinOptions): Promise<JoinChannelResponse>;
  abstract leave(): Promise<LeaveChannelResponse>;
  abstract joinTopic(
    topicName: string,
    options?: joinTopicOptions
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
