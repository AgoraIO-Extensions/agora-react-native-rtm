import { LockDetail } from './RTMLock';
import { StateDetail } from './RTMPresence';
import { StorageData } from './RTMStorage';
import { ChannelType, ServiceType } from './common';
import * as ConstantsType from './constants/rtm-enum';

export declare namespace RTMEvents {
  export interface PublishInfo {
    /**
     * The publisher user ID
     */
    publisherUserId: string;

    /**
     * The metadata of the publisher
     */
    publisherMeta: string;
  }
  export interface topicDetail {
    /**
     * The name of the topic
     */
    topicName: string;
    /**
     * The publisher array
     */
    publishers: PublishInfo[];
    /**
     * The count of publisher in current topic
     */
    totalPublisher: number;
  }

  export interface UserState {
    /**
     * The user id.
     */
    userId: string;
    /**
     * The user states.
     */
    states: StateDetail;

    statesCount: number;
  }
  export interface UserList {
    /**
     * The list of users.
     */
    users: string[];
    /**
     * The number of users.
     */
    userCount: number;
  }
  export interface IntervalDetail {
    /**
     * Joined users during this interval
     */
    join: UserList;
    /**
     * Left users during this interval
     */
    leave: UserList;
    /**
     * Timeout users during this interval
     */
    timeout: UserList;
    /**
     * The user state changed during this interval
     */
    userStateList: UserState[];
  }

  // ok
  export interface PresenceEvent {
    // 触发事件的时机
    eventType: ConstantsType.PresenceEventType;

    // 触发事件的频道的类型
    channelType: ChannelType;

    // 触发事件的频道
    channelName: string;

    // 触发事件的用户
    publisher: string;

    // 用户 state, 仅在用户设置, 更新或删除 state 时有效
    stateChanged: StateDetail;

    // 仅在 interval 模式下有效
    interval: IntervalDetail | null;

    // 当收到 snapshot 事件时有效
    snapshot: UserState[] | null;

    timestamp: number;
  }

  export interface StreamChannelConnectionStatusChangeEvent {
    // 频道名称
    channelName: string;

    // 当前连接状态
    state: string;

    // 事件被触发的原因
    reason: string;
    timestamp: number;
  }

  export interface RTMConnectionStatusChangeEvent {
    // 当前连接状态
    state: ConstantsType.ConnectionState;
    // 事件被触发的原因
    reason: ConstantsType.ConnectionChangeReason;
    timestamp: number;
  }

  export interface MessageEvent {
    // 频道类型
    channelType: ChannelType;

    // 频道名
    channelName: string;

    // topic 名
    topicName: string;

    // 消息类型，目前支持 string 与 binary
    messageType: 'STRING' | 'BINARY';

    // 消息负载自定义类型，目前支持 string
    customType: string;

    // 具体消息
    message: string | Uint8Array;

    // 消息发送者
    publisher: string;

    // channelGroup: string;

    // Publish timetoken
    publishTime?: number;

    timestamp: number;
  }

  export interface StorageEvent {
    channelType: ChannelType;

    // 远端操作了频道属性
    channelName: string;

    // 远端操作了用户属性
    publisher: string;

    // channelGroup: string;

    // 目前不支持
    // publishTimeToken: number;

    // 目前不支持
    // publisher: string;

    // 用户属性或者频道属性
    storageType: ConstantsType.StorageType;

    // 目前不支持
    // 事件触发类型
    eventType: ConstantsType.StorageEventType;

    // // 事件对应的变更返回数据，根据Console中 Metadata-deltas设置，此项可以是频道属性的全量数据也可以是delta数据。
    data: StorageData;

    timestamp: number;
  }

  export interface LockEvent {
    channelType: ChannelType;

    channelName: string;

    // channelGroup: string;

    eventType: ConstantsType.LockEventType;

    lockName: string;

    ttl: number;

    //The Publisher
    publisher: string;

    // 当 type 为 snapshot 时有效
    snapshot: LockDetail[];

    owner: string;

    timestamp: number;
  }
  export interface TopicEvent {
    /**
     * Indicate topic event type
     */
    eventType: ConstantsType.TopicEventType;
    /**
     * The channel which the topic event was triggered
     */
    channelName: string;
    /**
     * The publisher which the topic event was triggered
     */
    publisher: string;
    /**
     * Topic information array.
     */
    topicInfos: topicDetail[];
    /**
     * The count of topicInfos.
     */
    totalTopics: number;

    timestamp: number;
  }

  export type LinkOperation =
    | 'LOGIN'
    | 'LOGOUT'
    | 'JOIN'
    | 'LEAVE'
    | 'SERVER_REJECT'
    | 'AUTO_RECONNECT'
    | 'RECONNECTED'
    | 'HEARTBEAT_TIMEOUT' // TODO: 心跳超时 每次发 PingPong 需要在一定时间内收到，如果没收到代表超时
    | 'SERVER_TIMEOUT' // syncFin 断连， initAck code 也不为 0 时，或者 initAck 超时收不到，表示 server timeout
    | 'NETWORK_CHANGE'; // 当判断当前网络变化时，给出 network change

  export type LinkState =
    | 'IDLE'
    | 'CONNECTING'
    | 'CONNECTED'
    | 'DISCONNECTED'
    | 'SUSPENDED'
    | 'FAILED';

  export type LinkStateChangeReasonCode =
    | 'UNKNOWN'
    | 'LOGIN'
    | 'LOGIN_SUCCESS'
    | 'LOGIN_TIMEOUT'
    | 'LOGIN_NOT_AUTHORIZED'
    | 'LOGIN_REJECTED'
    | 'RELOGIN'
    | 'LOGOUT'
    | 'AUTO_RECONNECT'
    | 'RECONNECT_TIMEOUT'
    | 'RECONNECT_SUCCESS'
    | 'JOIN'
    | 'JOIN_SUCCESS'
    | 'JOIN_FAILED'
    | 'REJOIN'
    | 'LEAVE'
    | 'INVALID_TOKEN'
    | 'TOKEN_EXPIRED'
    | 'INCONSISTENT_APP_ID'
    | 'INVALID_CHANNEL_NAME'
    | 'INVALID_USER_ID'
    | 'NOT_INITIALIZED'
    | 'RTM_SERVICE_NOT_CONNECTED'
    | 'CHANNEL_INSTANCE_EXCEED_LIMITATION'
    | 'OPERATION_RATE_EXCEED_LIMITATION'
    | 'CHANNEL_IN_ERROR_STATE'
    | 'PRESENCE_NOT_CONNECTED'
    | 'SAME_UID_LOGIN'
    | 'KICKED_OUT_BY_SERVER'
    | 'KEEP_ALIVE_TIMEOUT'
    | 'CONNECTION_ERROR'
    | 'PRESENCE_NOT_READY'
    | 'NETWORK_CHANGE'
    | 'SERVICE_NOT_SUPPORTED'
    | 'STREAM_CHANNEL_NOT_AVAILABLE'
    | 'STORAGE_NOT_AVAILABLE'
    | 'LOCK_NOT_AVAILABLE'
    | 'LOGIN_TOO_FREQUENT';

  export interface LinkStateEvent {
    currentState: LinkState;
    previousState: LinkState;
    serviceType: ServiceType;
    operation: LinkOperation;
    reason: string;
    reasonCode: LinkStateChangeReasonCode;
    affectedChannels: string[];
    unrestoredChannels: string[];
    isResumed: boolean; // 是否从 disconnected 恢复
    timestamp: number;
  }

  export interface RTMClientEventMap {
    // // rtm2.0: 本地连接状态改变时会触发
    // // connectionState：客户端SDK连接/重新连接上服务器的事件监听和处理程序。
    // connectionStatus: (status: ConnectionStateChangeEvent) => void;

    /** @zh-cn
     * 通知 SDK 与 Agora RTM 系统的连接状态发生了改变。
     * @event
     * @param connectionStatus.newState 新的连接状态
     * @param connectionStatus.reason 状态改变的原因
     */
    /**
     * Occurs when the connection state changes between the SDK and the Agora RTM system.
     * @event
     * @param connectionStatus.newState The new connection state.
     * @param connectionStatus.reason Reasons for the connection state change.
     */
    status: (
      connectionStatus:
        | RTMConnectionStatusChangeEvent
        | StreamChannelConnectionStatusChangeEvent
    ) => void;

    // rtm2.0: 六种触发时机: 参考 PresenceType
    // event payload 包含了 presence 事件类型(join, leave, timeout, state-change，interval), 时间戳, 发送者UID, 用户状态等数据.。
    presence: (presenceData: PresenceEvent) => void;

    // rtm2.0: 订阅的用户发消息时触发
    // 客户端收到消息的事件监听处理程序. event payload 包含了消息内容, 发送时间戳, 发送者UID等信息
    message: (message: MessageEvent) => void;

    // storage 存用户/频道 meta
    // Storage事件监听处理程序 ，比如User storage变更和频道Storage 变更事件等。
    storage: (storageData: StorageEvent) => void;

    lock: (lockInfo: LockEvent) => void;

    topic: (topicEvent: TopicEvent) => void;

    // /** @zh-cn
    //  * （SDK 断线重连时触发）当前使用的 RTM Token 已超过 24 小时的签发有效期。
    //  *
    //  * - 该回调仅会在 SDK 处于 `RECONNECTING` 状态时因 RTM 后台监测到 Token 签发有效期过期而触发。SDK 处于 `CONNECTED` 状态时该回调不会被触发。
    //  * - 收到该回调时，请尽快在你的业务服务端生成新的 Token 并调用 {@link renewToken} 方法把新的 Token 传给 Token 验证服务器。
    //  */
    // /**
    //  * Occurs when the RTM server detects that the RTM token has exceeded the 24-hour validity period and when the SDK is in the `RECONNECTING` state.
    //  *
    //  * - This callback occurs only when the SDK is reconnecting to the server. You will not receive this callback when the SDK is in the `CONNECTED` state.
    //  * - When receiving this callback, generate a new RTM Token on the server and call the {@link renewToken} method to pass the new Token on to the server.
    //  */
    // TokenExpired: () => void;

    /** @zh-cn
     *   当前使用的 RTM Token 登录权限还有 30 秒就会超过签发有效期。
     *
     * - 收到该回调时，请尽快在你的业务服务端生成新的 Token 并调用 {@link RTMClient.renewToken} 方法把新的 Token 传给 Token 验证服务器。
     */
    /**
     * The currently used RTM Token login permission will expire after 30 seconds.
     *
     * - When receiving this callback, generate a new RTM Token on the server and call the {@link RTMClient.renewToken} method to pass the new Token on to the server.
     */
    tokenPrivilegeWillExpire: (channelName: string) => void;

    linkState: (linkState: LinkStateEvent) => void;
  }
}
export type RTMEventMap = RTMEvents.RTMClientEventMap;
export type EventName = keyof RTMEventMap;
export type EventPayload<EventName extends keyof RTMEventMap> = Parameters<
  RTMEventMap[EventName]
>[0];
