import { BaseResponse } from './common';

export interface StreamChannelOperationResponse extends BaseResponse {
  topicName: string;
}

export interface JoinChannelResponse extends BaseResponse {}

export interface LeaveChannelResponse extends JoinChannelResponse {}

export interface JoinTopicResponse extends StreamChannelOperationResponse {}

export interface LeaveTopicResponse extends JoinTopicResponse {}

export interface PublishTopicMessageResponse
  extends StreamChannelOperationResponse {}

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

export interface SubscribeTopicOptions {
  users?: string[];
  // todo: 2.1 api
  // topic 的 presence 事件； sdk 侧判定是否将事件抛出吗 ??? ❓
  // withPresence?: boolean;
}

export interface UnsubscribeTopicOptions {
  users?: string[];
}

export declare class RTMStreamChannel {
  /**@zh-cn
   * 加入此频道。
   * @param options.token 登入 rtc 的 token。若未开启 token 功能则需要设置为 null。
   * @param options.withLock 可选参数，是否同时订阅分布式锁更新事件。默认值为 false。
   * @param options.withMetadata 可选参数，是否同时订阅频道属性。 默认值为 false。
   * @param options.withPresence 可选参数，是否同时订阅频道出席事件。 默认值为 true。
   */
  /**
   * Join this channel.
   * @param options.token Login token of rtc. If the token function is not enabled, it needs to be set to null.
   * @param options.withLock Optional parameter, whether to subscribe to the distributed lock update event at the same time. The default value is false. @default false
   * @param options.withMetadata Optional parameter, whether to subscribe to channel properties at the same time. The default value is false. @default false
   * @param options.withPresence Optional parameter, whether to subscribe to channel presence event at the same time. The default value is true. @default true
   */
  join(options?: JoinOptions): Promise<JoinChannelResponse>;

  /**@zh-cn
   * 离开此频道
   */
  /**
   * Leave this channel.
   */
  leave(): Promise<LeaveChannelResponse>;

  /**@zh-cn
   * 加入指定 topic。
   * @param topicName 要加入的 topic 名称。
   */
  /**
   * Join a specific topic.
   * @param topicName The topic name to join.
   * @param options.meta @default ''
   */
  joinTopic(
    topicName: string,
    options?: joinTopicOptions
  ): Promise<JoinTopicResponse>;

  /**@zh-cn
   * 在指定 topic 内发消息。
   * @param topicName 指定的 topic 名称。
   * @param message 要发送的消息，支持文本消息和二进制消息。
   */
  /**
   * Send a message in the specified topic.
   * @param topicName The specified topic name.
   * @param message The message to send, supports text messages and binary messages.
   */
  publishTopicMessage(
    // options?: { meta?: string }
    topicName: string,
    message: string | Uint8Array,
    options?: PublishTopicMessageOptions
  ): Promise<PublishTopicMessageResponse>;

  /**@zh-cn
   * 离开指定 topic 。
   */
  /**
   * Leave a specified topic.
   * @param topicName The topic name to leave.
   */
  leaveTopic(topicName: string): Promise<LeaveTopicResponse>;

  /**@zh-cn
   * 订阅指定 topic 内的用户。
   * @param options.users users 为空时，默认订阅这个 topic 所有 user，当列表超出 64 人，随机订阅 64 人。
   */
  /**
   * Subscribe users in the specified topic.
   * @param options.users When users is empty, all users of this topic will be subscribed by default. When the list exceeds 64 users, 64 users will be randomly subscribed.
   */
  subscribeTopic(
    topicName: string,
    options?: SubscribeTopicOptions
  ): Promise<SubscribeTopicResponse>;

  /**@zh-cn
   * 退订指定 topic 内的用户。
   * @param options.users users 为空时，默认取消订阅这个 topic 所有 user。
   */
  /**
   * Unsubscribe users in the specified topic.
   * @param options.users When users is empty, all users of this topic will be unsubscribed by default.
   */
  unsubscribeTopic(
    topicName: string,
    options?: UnsubscribeTopicOptions
  ): Promise<UnsubscribeTopicResponse>;

  /**@zh-cn
   * 获取订阅了频道内指定 topic 下的哪些用户 。
   */
  /**
   * Get which users under the specified topic in the channel are subscribed..
   * @param topicName The specified topic name.
   */
  getSubscribedUserList(topicName: string): GetSubscribedUserListResponse;
}
