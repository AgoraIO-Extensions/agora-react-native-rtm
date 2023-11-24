import {
  ChannelInfo,
  LockDetail,
  PublishOptions,
  RTM_AREA_CODE,
  RTM_CHANNEL_TYPE,
  RTM_CONNECTION_CHANGE_REASON,
  RTM_CONNECTION_STATE,
  RTM_ERROR_CODE,
  RTM_LOCK_EVENT_TYPE,
  RTM_MESSAGE_TYPE,
  RTM_PRESENCE_EVENT_TYPE,
  RTM_STORAGE_EVENT_TYPE,
  RTM_STORAGE_TYPE,
  RTM_TOPIC_EVENT_TYPE,
  RtmEncryptionConfig,
  RtmLogConfig,
  RtmProxyConfig,
  StateItem,
  SubscribeOptions,
  TopicInfo,
  UserList,
  UserState,
} from './AgoraRtmBase';
import { IRtmLock } from './IAgoraRtmLock';
import { IRtmPresence } from './IAgoraRtmPresence';
import { IRtmStorage, RtmMetadata } from './IAgoraRtmStorage';
import { IStreamChannel } from './IAgoraStreamChannel';

/// Generated by terra, DO NOT MODIFY BY HAND.

/**
 *  Configurations for RTM Client.
 */
export class RtmConfig {
  /**
   * The App ID of your project.
   */
  appId?: string;
  /**
   * The ID of the user.
   */
  userId?: string;
  /**
   * The region for connection. This advanced feature applies to scenarios that
   * have regional restrictions.
   *
   * For the regions that Agora supports, see #AREA_CODE.
   *
   * After specifying the region, the SDK connects to the Agora servers within
   * that region.
   */
  areaCode?: RTM_AREA_CODE = RTM_AREA_CODE.RTM_AREA_CODE_GLOB;
  /**
   * Presence timeout in seconds, specify the timeout value when you lost connection between sdk
   * and rtm service.
   */
  presenceTimeout?: number = 300;
  /**
   * - For Android, it is the context of Activity or Application.
   * - For Windows, it is the window handle of app. Once set, this parameter enables you to plug
   * or unplug the video devices while they are powered.
   */
  context?: void;
  /**
   * Whether to use String user IDs, if you are using RTC products with Int user IDs,
   * set this value as 'false'. Otherwise errors might occur.
   */
  useStringUserId?: boolean = true;
  /**
   * The callbacks handler
   */
  eventHandler?: IRtmEventHandler;
  /**
   * The config for customer set log path, log size and log level.
   */
  logConfig?: RtmLogConfig;
  /**
   * The config for proxy setting
   */
  proxyConfig?: RtmProxyConfig;
  /**
   * The config for encryption setting
   */
  encryptionConfig?: RtmEncryptionConfig;
  constructor(
    props?: Partial<{
      appId?: string;
      userId?: string;
      areaCode?: RTM_AREA_CODE;
      presenceTimeout?: number;
      context?: void;
      useStringUserId?: boolean;
      eventHandler?: IRtmEventHandler;
      logConfig?: RtmLogConfig;
      proxyConfig?: RtmProxyConfig;
      encryptionConfig?: RtmEncryptionConfig;
    }>
  ) {
    Object.assign(this, props);
  }
}

export class MessageEvent {
  /**
   * Which channel type, RTM_CHANNEL_TYPE_STREAM or RTM_CHANNEL_TYPE_MESSAGE
   */
  channelType?: RTM_CHANNEL_TYPE;
  /**
   * Message type
   */
  messageType?: RTM_MESSAGE_TYPE;
  /**
   * The channel which the message was published
   */
  channelName?: string;
  /**
   * If the channelType is RTM_CHANNEL_TYPE_STREAM, which topic the message came from. only for RTM_CHANNEL_TYPE_STREAM
   */
  channelTopic?: string;
  /**
   * The payload
   */
  message?: string;
  /**
   * The payload length
   */
  messageLength?: number;
  /**
   * The publisher
   */
  publisher?: string;
  /**
   * The custom type of the message
   */
  customType?: string;
  constructor(
    props?: Partial<{
      channelType?: RTM_CHANNEL_TYPE;
      messageType?: RTM_MESSAGE_TYPE;
      channelName?: string;
      channelTopic?: string;
      message?: string;
      messageLength?: number;
      publisher?: string;
      customType?: string;
    }>
  ) {
    Object.assign(this, props);
  }
}

export class IntervalInfo {
  /**
   * Joined users during this interval
   */
  joinUserList?: UserList;
  /**
   * Left users during this interval
   */
  leaveUserList?: UserList;
  /**
   * Timeout users during this interval
   */
  timeoutUserList?: UserList;
  /**
   * The user state changed during this interval
   */
  userStateList?: UserState[];
  /**
   * The user count
   */
  userStateCount?: number;
  constructor(
    props?: Partial<{
      joinUserList?: UserList;
      leaveUserList?: UserList;
      timeoutUserList?: UserList;
      userStateList?: UserState[];
      userStateCount?: number;
    }>
  ) {
    Object.assign(this, props);
  }
}

export class TopicEvent {
  /**
   * Indicate topic event type
   */
  type?: RTM_TOPIC_EVENT_TYPE;
  /**
   * The channel which the topic event was triggered
   */
  channelName?: string;
  /**
   * The user who triggered this event.
   */
  publisher?: string;
  /**
   * Topic information array.
   */
  topicInfos?: TopicInfo[];
  /**
   * The count of topicInfos.
   */
  topicInfoCount?: number;
  constructor(
    props?: Partial<{
      type?: RTM_TOPIC_EVENT_TYPE;
      channelName?: string;
      publisher?: string;
      topicInfos?: TopicInfo[];
      topicInfoCount?: number;
    }>
  ) {
    Object.assign(this, props);
  }
}

export class SnapshotInfo {
  /**
   * The user state in this snapshot event
   */
  userStateList?: UserState[];
  /**
   * The user count
   */
  userCount?: number;
  constructor(
    props?: Partial<{
      userStateList?: UserState[];
      userCount?: number;
    }>
  ) {
    Object.assign(this, props);
  }
}

export class PresenceEvent {
  /**
   * Indicate presence event type
   */
  type?: RTM_PRESENCE_EVENT_TYPE;
  /**
   * Which channel type, RTM_CHANNEL_TYPE_STREAM or RTM_CHANNEL_TYPE_MESSAGE
   */
  channelType?: RTM_CHANNEL_TYPE;
  /**
   * The channel which the presence event was triggered
   */
  channelName?: string;
  /**
   * The user who triggered this event.
   */
  publisher?: string;
  /**
   * The user states
   */
  stateItems?: StateItem[];
  /**
   * The states count
   */
  stateItemCount?: number;
  /**
   * Only valid when in interval mode
   */
  interval?: IntervalInfo;
  /**
   * Only valid when receive snapshot event
   */
  snapshot?: SnapshotInfo;
  constructor(
    props?: Partial<{
      type?: RTM_PRESENCE_EVENT_TYPE;
      channelType?: RTM_CHANNEL_TYPE;
      channelName?: string;
      publisher?: string;
      stateItems?: StateItem[];
      stateItemCount?: number;
      interval?: IntervalInfo;
      snapshot?: SnapshotInfo;
    }>
  ) {
    Object.assign(this, props);
  }
}

export class LockEvent {
  /**
   * Which channel type, RTM_CHANNEL_TYPE_STREAM or RTM_CHANNEL_TYPE_MESSAGE
   */
  channelType?: RTM_CHANNEL_TYPE;
  /**
   * Lock event type, indicate lock states
   */
  eventType?: RTM_LOCK_EVENT_TYPE;
  /**
   * The channel which the lock event was triggered
   */
  channelName?: string;
  /**
   * The detail information of locks
   */
  lockDetailList?: LockDetail[];
  /**
   * The count of locks
   */
  count?: number;
  constructor(
    props?: Partial<{
      channelType?: RTM_CHANNEL_TYPE;
      eventType?: RTM_LOCK_EVENT_TYPE;
      channelName?: string;
      lockDetailList?: LockDetail[];
      count?: number;
    }>
  ) {
    Object.assign(this, props);
  }
}

export class StorageEvent {
  /**
   * Which channel type, RTM_CHANNEL_TYPE_STREAM or RTM_CHANNEL_TYPE_MESSAGE
   */
  channelType?: RTM_CHANNEL_TYPE;
  /**
   * Storage type, RTM_STORAGE_TYPE_USER or RTM_STORAGE_TYPE_CHANNEL
   */
  storageType?: RTM_STORAGE_TYPE;
  /**
   * Indicate storage event type
   */
  eventType?: RTM_STORAGE_EVENT_TYPE;
  /**
   * The target name of user or channel, depends on the RTM_STORAGE_TYPE
   */
  target?: string;
  /**
   * The metadata information
   */
  data?: RtmMetadata;
  constructor(
    props?: Partial<{
      channelType?: RTM_CHANNEL_TYPE;
      storageType?: RTM_STORAGE_TYPE;
      eventType?: RTM_STORAGE_EVENT_TYPE;
      target?: string;
      data?: RtmMetadata;
    }>
  ) {
    Object.assign(this, props);
  }
}

/**
 * The IRtmEventHandler class.
 *
 * The SDK uses this class to send callback event notifications to the app, and the app inherits
 * the methods in this class to retrieve these event notifications.
 *
 * All methods in this class have their default (empty)  implementations, and the app can inherit
 * only some of the required events instead of all. In the callback methods, the app should avoid
 * time-consuming tasks or calling blocking APIs, otherwise the SDK may not work properly.
 */
export interface IRtmEventHandler {
  /**
   * Occurs when receive a message.
   *
   * @param event details of message event.
   */
  onMessageEvent?(event: MessageEvent): void;
  /**
   * Occurs when remote user presence changed
   *
   * @param event details of presence event.
   */
  onPresenceEvent?(event: PresenceEvent): void;
  /**
   * Occurs when remote user join/leave topic or when user first join this channel,
   * got snapshot of topics in this channel
   *
   * @param event details of topic event.
   */
  onTopicEvent?(event: TopicEvent): void;
  /**
   * Occurs when lock state changed
   *
   * @param event details of lock event.
   */
  onLockEvent?(event: LockEvent): void;
  /**
   * Occurs when receive storage event
   *
   * @param event details of storage event.
   */
  onStorageEvent?(event: StorageEvent): void;
  /**
   * Occurs when user join a stream channel.
   *
   * @param channelName The name of the channel.
   * @param userId The id of the user.
   * @param errorCode The error code.
   */
  onJoinResult?(
    requestId: number,
    channelName: string,
    userId: string,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when user leave a stream channel.
   *
   * @param channelName The name of the channel.
   * @param userId The id of the user.
   * @param errorCode The error code.
   */
  onLeaveResult?(
    requestId: number,
    channelName: string,
    userId: string,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when user join topic.
   *
   * @param channelName The name of the channel.
   * @param userId The id of the user.
   * @param topic The name of the topic.
   * @param meta The meta of the topic.
   * @param errorCode The error code.
   */
  onJoinTopicResult?(
    requestId: number,
    channelName: string,
    userId: string,
    topic: string,
    meta: string,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when user leave topic.
   *
   * @param channelName The name of the channel.
   * @param userId The id of the user.
   * @param topic The name of the topic.
   * @param meta The meta of the topic.
   * @param errorCode The error code.
   */
  onLeaveTopicResult?(
    requestId: number,
    channelName: string,
    userId: string,
    topic: string,
    meta: string,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when user subscribe topic.
   *
   * @param channelName The name of the channel.
   * @param userId The id of the user.
   * @param topic The name of the topic.
   * @param succeedUsers The subscribed users.
   * @param failedUser The failed to subscribe users.
   * @param errorCode The error code.
   */
  onSubscribeTopicResult?(
    requestId: number,
    channelName: string,
    userId: string,
    topic: string,
    succeedUsers: UserList,
    failedUsers: UserList,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when the connection state changes between rtm sdk and agora service.
   *
   * @param channelName The name of the channel.
   * @param state The new connection state.
   * @param reason The reason for the connection state change.
   */
  onConnectionStateChanged?(
    channelName: string,
    state: RTM_CONNECTION_STATE,
    reason: RTM_CONNECTION_CHANGE_REASON
  ): void;
  /**
   * Occurs when token will expire in 30 seconds.
   *
   * @param channelName The name of the channel.
   */
  onTokenPrivilegeWillExpire?(channelName: string): void;
  /**
   * Occurs when subscribe a channel
   *
   * @param channelName The name of the channel.
   * @param errorCode The error code.
   */
  onSubscribeResult?(
    requestId: number,
    channelName: string,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when user publish message.
   *
   * @param requestId The related request id when user publish message
   * @param errorCode The error code.
   */
  onPublishResult?(requestId: number, errorCode: RTM_ERROR_CODE): void;
  /**
   * Occurs when user login.
   *
   * @param errorCode The error code.
   */
  onLoginResult?(errorCode: RTM_ERROR_CODE): void;
  /**
   * Occurs when user setting the channel metadata
   *
   * @param requestId The related request id when user perform this operation
   * @param channelName The name of the channel.
   * @param channelType The type of the channel.
   * @param errorCode The error code.
   */
  onSetChannelMetadataResult?(
    requestId: number,
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when user updating the channel metadata
   *
   * @param requestId The related request id when user perform this operation
   * @param channelName The name of the channel.
   * @param channelType The type of the channel.
   * @param errorCode The error code.
   */
  onUpdateChannelMetadataResult?(
    requestId: number,
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when user removing the channel metadata
   *
   * @param requestId The related request id when user perform this operation
   * @param channelName The name of the channel.
   * @param channelType The type of the channel.
   * @param errorCode The error code.
   */
  onRemoveChannelMetadataResult?(
    requestId: number,
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when user try to get the channel metadata
   *
   * @param requestId The related request id when user perform this operation
   * @param channelName The name of the channel.
   * @param channelType The type of the channel.
   * @param data The result metadata of getting operation.
   * @param errorCode The error code.
   */
  onGetChannelMetadataResult?(
    requestId: number,
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    data: RtmMetadata,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when user setting the user metadata
   *
   * @param requestId The related request id when user perform this operation
   * @param userId The id of the user.
   * @param errorCode The error code.
   */
  onSetUserMetadataResult?(
    requestId: number,
    userId: string,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when user updating the user metadata
   *
   * @param requestId The related request id when user perform this operation
   * @param userId The id of the user.
   * @param errorCode The error code.
   */
  onUpdateUserMetadataResult?(
    requestId: number,
    userId: string,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when user removing the user metadata
   *
   * @param requestId The related request id when user perform this operation
   * @param userId The id of the user.
   * @param errorCode The error code.
   */
  onRemoveUserMetadataResult?(
    requestId: number,
    userId: string,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when user try to get the user metadata
   *
   * @param requestId The related request id when user perform this operation
   * @param userId The id of the user.
   * @param data The result metadata of getting operation.
   * @param errorCode The error code.
   */
  onGetUserMetadataResult?(
    requestId: number,
    userId: string,
    data: RtmMetadata,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when user subscribe a user metadata
   *
   * @param userId The id of the user.
   * @param errorCode The error code.
   */
  onSubscribeUserMetadataResult?(
    requestId: number,
    userId: string,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when user set a lock
   *
   * @param channelName The name of the channel.
   * @param channelType The type of the channel.
   * @param lockName The name of the lock.
   * @param errorCode The error code.
   */
  onSetLockResult?(
    requestId: number,
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when user delete a lock
   *
   * @param channelName The name of the channel.
   * @param channelType The type of the channel.
   * @param lockName The name of the lock.
   * @param errorCode The error code.
   */
  onRemoveLockResult?(
    requestId: number,
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when user release a lock
   *
   * @param channelName The name of the channel.
   * @param channelType The type of the channel.
   * @param lockName The name of the lock.
   * @param errorCode The error code.
   */
  onReleaseLockResult?(
    requestId: number,
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when user acquire a lock
   *
   * @param channelName The name of the channel.
   * @param channelType The type of the channel.
   * @param lockName The name of the lock.
   * @param errorCode The error code.
   */
  onAcquireLockResult?(
    requestId: number,
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string,
    errorCode: RTM_ERROR_CODE,
    errorDetails: string
  ): void;
  /**
   * Occurs when user revoke a lock
   *
   * @param channelName The name of the channel.
   * @param channelType The type of the channel.
   * @param lockName The name of the lock.
   * @param errorCode The error code.
   */
  onRevokeLockResult?(
    requestId: number,
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when user try to get locks from the channel
   *
   * @param channelName The name of the channel.
   * @param channelType The type of the channel.
   * @param lockDetailList The details of the locks.
   * @param count The count of the locks.
   * @param errorCode The error code.
   */
  onGetLocksResult?(
    requestId: number,
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockDetailList: LockDetail[],
    count: number,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when query who joined this channel
   *
   * @param requestId The related request id when user perform this operation
   * @param userStatesList The states the users.
   * @param count The user count.
   * @param errorCode The error code.
   */
  onWhoNowResult?(
    requestId: number,
    userStateList: UserState[],
    count: number,
    nextPage: string,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when query who joined this channel
   *
   * @param requestId The related request id when user perform this operation
   * @param userStatesList The states the users.
   * @param count The user count.
   * @param errorCode The error code.
   */
  onGetOnlineUsersResult?(
    requestId: number,
    userStateList: UserState[],
    count: number,
    nextPage: string,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when query which channels the user joined
   *
   * @param requestId The related request id when user perform this operation
   * @param channels The channel informations.
   * @param count The channel count.
   * @param errorCode The error code.
   */
  onWhereNowResult?(
    requestId: number,
    channels: ChannelInfo[],
    count: number,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when query which channels the user joined
   *
   * @param requestId The related request id when user perform this operation
   * @param channels The channel informations.
   * @param count The channel count.
   * @param errorCode The error code.
   */
  onGetUserChannelsResult?(
    requestId: number,
    channels: ChannelInfo[],
    count: number,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when set user presence
   *
   * @param requestId The related request id when user perform this operation
   * @param errorCode The error code.
   */
  onPresenceSetStateResult?(requestId: number, errorCode: RTM_ERROR_CODE): void;
  /**
   * Occurs when delete user presence
   *
   * @param requestId The related request id when user perform this operation
   * @param errorCode The error code.
   */
  onPresenceRemoveStateResult?(
    requestId: number,
    errorCode: RTM_ERROR_CODE
  ): void;
  /**
   * Occurs when get user presence
   *
   * @param requestId The related request id when user perform this operation
   * @param states The user states
   * @param errorCode The error code.
   */
  onPresenceGetStateResult?(
    requestId: number,
    state: UserState,
    errorCode: RTM_ERROR_CODE
  ): void;
}

/**
 * The IRtmClient class.
 *
 * This class provides the main methods that can be invoked by your app.
 *
 * IRtmClient is the basic interface class of the Agora RTM SDK.
 * Creating an IRtmClient object and then calling the methods of
 * this object enables you to use Agora RTM SDK's functionality.
 */
export abstract class IRtmClient {
  /**
   * Initializes the rtm client instance.
   *
   * @param [in] config The configurations for RTM Client.
   * @param [in] eventHandler .
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  abstract initialize(config: RtmConfig): number;
  /**
   * Release the rtm client instance.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  abstract release(): number;
  /**
   * Login the Agora RTM service. The operation result will be notified by \ref agora::rtm::IRtmEventHandler::onLoginResult callback.
   *
   * @param [in] token Token used to login RTM service.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  abstract login(token: string): number;
  /**
   * Logout the Agora RTM service. Be noticed that this method will break the rtm service including storage/lock/presence.
   *
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  abstract logout(): number;
  /**
   * Get the storage instance.
   *
   * @return
   * - return NULL if error occurred
   */
  abstract getStorage(): IRtmStorage;
  /**
   * Get the lock instance.
   *
   * @return
   * - return NULL if error occurred
   */
  abstract getLock(): IRtmLock;
  /**
   * Get the presence instance.
   *
   * @return
   * - return NULL if error occurred
   */
  abstract getPresence(): IRtmPresence;
  /**
   * Renews the token. Once a token is enabled and used, it expires after a certain period of time.
   * You should generate a new token on your server, call this method to renew it.
   *
   * @param [in] token Token used renew.
   * - 0: Success.
   * - < 0: Failure.
   */
  abstract renewToken(token: string): number;
  /**
   * Publish a message in the channel.
   *
   * @param [in] channelName The name of the channel.
   * @param [in] message The content of the message.
   * @param [in] length The length of the message.
   * @param [in] option The option of the message.
   * @param [out] requestId The related request id of this operation.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  abstract publish(
    channelName: string,
    message: string,
    length: number,
    option: PublishOptions,
    requestId?: number
  ): number;
  /**
   * Subscribe a channel.
   *
   * @param [in] channelName The name of the channel.
   * @param [in] options The options of subscribe the channel.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  abstract subscribe(
    channelName: string,
    options: SubscribeOptions,
    requestId?: number
  ): number;
  /**
   * Unsubscribe a channel.
   *
   * @param [in] channelName The name of the channel.
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  abstract unsubscribe(channelName: string): number;
  /**
   * Create a stream channel instance.
   *
   * @param [in] channelName The Name of the channel.
   * @return
   * - return NULL if error occurred
   */
  abstract createStreamChannel(channelName: string): IStreamChannel;
  /**
   * Set parameters of the sdk or engine
   *
   * @param [in] parameters The parameters in json format
   * @return
   * - 0: Success.
   * - < 0: Failure.
   */
  abstract setParameters(parameters: string): number;
  abstract publishWithBuffer(
    channelName: string,
    message: Uint8Array,
    length: number,
    option: PublishOptions,
    requestId?: number
  ): number;
}