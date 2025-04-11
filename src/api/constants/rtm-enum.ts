/** @zh-cn
 * 连接状态改变原因
 */
/**
 * Reasons for a connection state change.
 */
export type ConnectionChangeReason =
  | 'CONNECTING'
  /** @zh-cn
   * SDK 登录 Agora RTM 系统成功。
   */
  /**
   * The SDK has logged in the Agora RTM system.
   */
  | 'LOGIN_SUCCESS'
  /** @zh-cn
   * SDK 登录 Agora RTM 系统失败。
   */
  /**
   * The SDK fails to log in the Agora RTM system, because, for example, the token has expired.
   */
  | 'REJECTED_BY_SERVER'
  /** @zh-cn
   * SDK 无法登录 Agora RTM 系统超过 6 秒，停止登录。
   */
  /**
   * The login has timed out, and the SDK stops logging in. The current login timeout is set as six seconds.
   */
  | 'LOST'
  /** @zh-cn
   * SDK 与 Agora RTM 系统的连接被中断超过 4 秒。
   */
  /**
   * The connection between the SDK and the Agora RTM system is interrupted for more than four seconds.
   */
  | 'INTERRUPTED'
  /** @zh-cn
   * SDK 已登出 Agora RTM 系统。
   */
  /**
   * The SDK has logged out of the Agora RTM system.
   */
  | 'LOGOUT'
  /** @zh-cn
   * SDK 被服务器禁止登录 Agora RTM 系统。
   */
  /**
   * Login is banned by the Agora RTM server.
   */
  /** @zh-cn
   * 另一个用户正以相同的 uid 登陆 Agora RTM 系统。
   */
  /**
   * Another instance has logged in the Agora RTM system with the same uid.
   */
  | 'SAME_UID_LOGIN'
  /** @zh-cn
   * 用户使用的token已过期。
   */
  /**
   * The token used by the user has expired.
   */
  | 'TOKEN_EXPIRED'
  /**
   * @zh-cn
   * 服务暂不可用。
   */
  /**】
   * The presence server not ready.
   */
  | 'PRESENCE_NOT_READY';

/** @zh-cn
 * SDK 与 Agora RTM 系统的连接状态类型
 */
/**
 * Connection states between the SDK and the Agora RTM system.
 */
export type ConnectionState =
  /** @zh-cn
   * 初始状态。SDK 未连接到 Agora RTM 系统。
   *
   * App 调用方法 {@link RTMClient.login} 时，SDK 开始登录 Agora RTM 系统，触发回调 {@link RTMEvents.status}，并切换到 {@link CONNECTING} 状态。
   *
   */
  /**
   * When the app calls the {@link RTMClient.login} method, the SDK logs in the Agora RTM system, triggers the {@link RTMEvents.status} callback, and switches to the {@link CONNECTING} state.
   */
  | 'DISCONNECTED'
  /** @zh-cn
   * SDK 正在登录 Agora RTM 系统。
   *
   * - 方法调用成功时，SDK 会触发回调 {@link RTMEvents.status}，并切换到 {@link CONNECTED} 状态。</li>
   * - 法调用失败，SDK 会触发回调 {@link RTMEvents.status}，并切换到 {@link DISCONNECTED} 状态。</li>
   *
   */
  /**
   * The SDK has logged in the Agora RTM system.
   * <ul>
   *     <li>Success = the SDK triggers the {@link RTMEvents.status} callback and switches to the {@link CONNECTED} state.</li,
   *     <li>Failure = the SDK triggers the {@link RTMEvents.status} callback and switches to the {@link DISCONNECTED} state.</li,
   * </ul>
   */
  | 'CONNECTING'
  /** @zh-cn
   * SDK 已登录 Agora RTM 系统。
   * <ul>
   *     <li>如果 SDK 与 Agora RTM 系统的连接由于网络问题中断，SDK 会触发回调 {@link RTMEvents.status}，并切换到 {@link RECONNECTING} 状态。</li>
   *     <li>如果 SDK 因为相同 ID 已在其他实例或设备中登录等原因被服务器禁止登录，会触发回调 {@link RTMEvents.status}，并切换到 {@link FAILED} 状态。</li>
   *     <li>如果 App 调用方法 {@link RTMClient.logout}，SDK 登出 Agora RTM 系统成功，会触发回调 {@link RTMEvents.status}，并切换到 {@link DISCONNECTED} 状态。</li>
   * </ul>
   */
  /**
   * The SDK has logged in the Agora RTM system.
   * <ul>
   *     <li>If the connection between the SDK and the Agora RTM system is interrupted because of network issues, the SDK triggers the {@link RTMEvents.status} callback and switches to the {@link RECONNECTING} state.</li>
   *     <li>If the login is banned by the server, for example, another instance has logged in with the same uid from a different device, the SDK triggers the {@link RTMEvents.status} callback and switches to the {@link FAILED} state.</li>
   *     <li>If the app calls the {@link RTMClient.logout} method and the SDK successfully logs out of the Agora RTM system, the SDK triggers the {@link RTMEvents.status} callback and switches to the {@link DISCONNECTED} state.</li>
   * </ul>
   */
  | 'RECONNECTING'
  /** @zh-cn
   * SDK 正在重新登录 Agora RTM 系统。
   *
   * <ul>
   *     <li>如果 SDK 重新登录 Agora RTM 系统成功，会触发回调 {@link RTMEvents.status}，并切换到 {@link CONNECTED} 状态。</li>
   *     <li>如果 SDK 重新登录 Agora RTM 系统失败，会保持  {@link RECONNECTING} 状态。</li>
   *     <li>如果登录被服务器拒绝，SDK 会触发回调 {@link RTMEvents.status}，并切换到 {@link FAILED} 状态。</li>
   * </ul>
   *
   */
  /**
   * The SDK keeps logging in the Agora RTM system.
   * <ul>
   *     <li>If the SDK successfully logs in the Agora RTM system again, it triggers the {@link  RTMEvents.status} callback and switches to the {@link CONNECTED} state.</li>
   *     <li>If the SDK fails to log in the Agora RTM system again, the SDK stays in the {@link RECONNECTING} state. </li>
   *     <li>If the login is rejected by the server, the SDK triggers the {@link  RTMEvents.status} callback and switches to the {@link FAILED} state.</li>
   * </ul>
   */
  | 'CONNECTED'
  /** @zh-cn
   * SDK 停止登录 Agora RTM 系统。
   *
   * <p>原因可能为：</p>
   * <p><ul>
   * <li>另一实例已经以同一用户 ID 登录 Agora RTM 系统。</li>
   * <li>token 已过期。</li></ul></p>
   * 请在调用方法 {@link RTMClient.logout} 后，调用方法 {@link RTMClient.login} 登录 Agora RTM 系统。</p>
   */
  /**
   * The SDK gives up logging in the Agora RTM system, possibly because another instance has logged in the Agora RTM system with the same uid.
   *
   * <p>Call the {@link RTMClient.logout} method before calling the {@link RTMClient.login} method to log in the Agora RTM system again.</p>
   */
  | 'FAILED';

/** @zh-cn
 * 用户元数据订阅状态。
 */
/**
 * The subscribed state of the user.
 */
/**
 * @internal
 */
export enum subscribedState {
  /** @zh-cn
   * 0: 用户取消订阅了对应用户。
   */
  /**
   * 0:The user unsubscribes the corresponding user
   */
  UNSUBSCRIBED = 'UNSUBSCRIBED',

  /** @zh-cn
   * 1: 用户订阅了对应用户。
   */
  /**
   * 1: The user subscribes to the corresponding user.
   */
  SUBSCRIBED = 'SUBSCRIBED',
}

/** @zh-cn
 * 消息类型。
 */
/**
 * Message types.
 */
export enum MessageType {
  /** @zh-cn
   * 文本消息。
   */
  /**
   * A strig message.
   */
  STRING = 'STRING',

  /** @zh-cn
   * 自定义二进制消息。
   */
  /**
   * A binary message.
   */
  BINARY = 'BINARY',
}

/** @ignore */
export enum LegacyAreaCode {
  /** @zh-cn
   * 中国大陆。
   */
  /**
   * Mainland China.
   */
  CN = 'CN',
  /** @zh-cn
   * 北美区域。
   */
  /**
   * North America.
   */
  NA = 'NA',
  /** @zh-cn
   * 欧洲区域。
   */
  /**
   * Europe.
   */
  EU = 'EU',
  /** @zh-cn
   * 除中国大陆以外的亚洲区域。
   */
  /**
   * Asia excluding mainland China.
   */
  AS = 'AS',
  /** @japan
   * 日本。
   */
  /**
   * Japan.
   */
  JP = 'JP',
  /** @india
   * 印度。
   */
  /**
   * India.
   */
  IN = 'IN',
  /** @global
   * （默认）全球。
   */
  /**
   * (Default) Global.
   */
  GLOB = 'GLOB',
  /** @Oceania
   * 大洋洲。
   */
  OC = 'OC',
  /** @South America
   * 南美洲。
   */
  SA = 'SA',
  /** @Africa
   * 非洲。
   */
  AF = 'AF',
  /** @south korea
   * 南韩。
   */
  KR = 'KR',
  /** @us
   * 美国。
   */
  US = 'US',
  /** @oversea
   * 海外。
   */
  OVS = 'OVS',
}

/** @zh-cn
 * Agora RTM 服务的限定区域。设置限定区域之后，Agora RTM SDK 只能连接位于限定区域的 Agora RTM 服务。
 */
/**
 * Region for the Agora RTM service. After setting a region, the Agora RTM SDK can only connect to the Agora RTM service in the specified region.
 */
export enum AreaCode {
  /** @zh-cn
   * （默认）全球。
   */
  /**
   * (Default) Global.
   */

  GLOBAL = 'GLOBAL',
  /** @zh-cn
   * 印度。
   */
  /**
   * India.
   */
  INDIA = 'INDIA',

  /** @zh-cn
   * 日本。
   */
  /**
   * Japan.
   */

  JAPAN = 'JAPAN',
  /** @zh-cn
   * 除中国大陆以外的亚洲区域。
   */
  /**
   * Asia excluding mainland China.
   */
  ASIA = 'ASIA',

  /** @zh-cn
   * 欧洲区域。
   */
  /**
   * Europe.
   */

  EUROPE = 'EUROPE',

  /** @zh-cn
   * 中国大陆。
   */
  /**
   * Mainland China.
   */
  CHINA = 'CHINA',

  /**
   * 北美区域。
   */
  /**
   * North America.
   */
  NORTH_AMERICA = 'NORTH_AMERICA',
}

export type EncryptionMode = 'NONE' | 'AES_128_GCM' | 'AES_256_GCM';

export type StorageType = 'NONE' | 'USER' | 'CHANNEL';

export type PresenceEventType =
  /**
   * 0: The presence none of this channel
   */
  | 'NONE'
  /**
   * 1: The presence snapshot of this channel
   */
  | 'SNAPSHOT'
  /**
   * 2: The presence event triggered in interval mode
   */
  | 'INTERVAL'
  /**
   * 3: Triggered when remote user join channel
   */
  | 'REMOTE_JOIN'
  /**
   * 4: Triggered when remote user leave channel
   */
  | 'REMOTE_LEAVE'
  /**
   * 5: Triggered when remote user's connection timeout
   */
  | 'REMOTE_TIMEOUT'
  /**
   * 5: Triggered when user changed state
   */
  | 'REMOTE_STATE_CHANGED'
  /**
   * 6: Triggered when user joined channel without presence service
   */
  | 'ERROR_OUT_OF_SERVICE';

export type TopicEventType =
  | 'NONE'
  /**
   * REMOTE_JOIN_TOPIC: Triggered when remote user join a topic
   */
  | 'REMOTE_JOIN'
  /**
   * REMOTE_LEAVE_TOPIC: Triggered when remote user leave a topic
   */
  | 'REMOTE_LEAVE'
  /**
   * REMOTE_SNAPSHOT: The topic snapshot of this channel
   */
  | 'SNAPSHOT';

export type StorageEventType =
  | 'NONE'

  // 远端用户设置 metadata
  | 'SET'
  | 'SNAPSHOT'

  // 远端用户删除 metadata
  | 'REMOVE'

  // 远端用户更新 metadata
  | 'UPDATE';

export type LockEventType =
  | 'NONE'

  // 当频道中有锁被设置的时候触发
  | 'SET'

  // 当频道中有锁被删除时触发
  | 'REMOVED'

  // 当频道中有锁被占用事触发
  | 'ACQUIRED'

  // 当频道中有锁被释放时触发
  | 'RELEASED'

  // 用户第一次加入频道后会触发，返回给用户此频道所有锁的详情信息
  | 'SNAPSHOT'

  // 当自己掉线后在 TTL 时间之外恢复链接时被触发，通知当前用户不再拥有这把锁，其他人会在TTL 时刻收到 released 事件
  | 'EXPIRED';

export enum LinkStateChangeReason4Report {
  /** * Unknown reason. */ UNKNOWN = 0,
  /** * Login. */ LOGIN = 1,
  /** * Login success. */ LOGIN_SUCCESS = 2,
  /** * Login timeout. */ LOGIN_TIMEOUT = 3,
  /** * Login not authorized. */ LOGIN_NOT_AUTHORIZED = 4,
  /** * Login rejected. */ LOGIN_REJECTED = 5,
  /** * Re-login. */ RELOGIN = 6,
  /** * Logout. */ LOGOUT = 7,
  /** * Auto reconnect. */ AUTO_RECONNECT = 8,
  /** * Reconnect timeout. */ RECONNECT_TIMEOUT = 9,
  /** * Reconnect success. */ RECONNECT_SUCCESS = 10,
  /** * Join. */ JOIN = 11,
  /** * Join success. */ JOIN_SUCCESS = 12,
  /** * Join failed. */ JOIN_FAILED = 13,
  /** * Rejoin. */ REJOIN = 14,
  /** * Leave. */ LEAVE = 15,
  /** * Invalid token. */ INVALID_TOKEN = 16,
  /** * Token expired. */ TOKEN_EXPIRED = 17,
  /** * Inconsistent app ID. */ INCONSISTENT_APP_ID = 18,
  /** * Invalid channel name. */ INVALID_CHANNEL_NAME = 19,
  /** * Invalid user ID. */ INVALID_USER_ID = 20,
  /** * Not initialized. */ NOT_INITIALIZED = 21,
  /** * Rtm service not connected. */ RTM_SERVICE_NOT_CONNECTED = 22,
  /** * Channel instance exceed limitation. */ CHANNEL_INSTANCE_EXCEED_LIMITATION = 23,
  /** * Operation rate exceed limitation. */ OPERATION_RATE_EXCEED_LIMITATION = 24,
  /** * Channel in error state. */ CHANNEL_IN_ERROR_STATE = 25,
  /** * Presence not connected. */ PRESENCE_NOT_CONNECTED = 26,
  /** * Same UID login. */ SAME_UID_LOGIN = 27,
  /** * Kicked out by server. */ KICKED_OUT_BY_SERVER = 28,
  /** * Keep alive timeout. */ KEEP_ALIVE_TIMEOUT = 29,
  /** * Connection error. */ CONNECTION_ERROR = 30,
  /** * Presence not ready. */ PRESENCE_NOT_READY = 31,
  /** * Network change. */ NETWORK_CHANGE = 32,
  /** * Service not supported. */ SERVICE_NOT_SUPPORTED = 33,
  /** * Stream channel not available. */ STREAM_CHANNEL_NOT_AVAILABLE = 34,
  /** * storage not available. */ STORAGE_NOT_AVAILABLE = 35,
  /** * Lock not available. */ LOCK_NOT_AVAILABLE = 36,
  /** * login too frequent */ LOGIN_TOO_FREQUENT = 37,
}

export enum LinkStateChangeReasonDescription {
  UNKNOWN = 'Unknown',
  LOGIN = 'Perform login operation',
  LOGIN_SUCCESS = 'Login success',
  LOGIN_TIMEOUT = 'Login timeout',
  LOGIN_NOT_AUTHORIZED = 'Login not authorized',
  LOGIN_REJECTED = 'Login rejected',
  RELOGIN = 'Perform login operation again',
  LOGOUT = 'Logout success',
  AUTO_RECONNECT = 'Reconnecting',
  RECONNECT_TIMEOUT = 'Reconnect timeout',
  RECONNECT_SUCCESS = 'Reconnect success',

  JOIN = 'Perform join operation',
  JOIN_SUCCESS = 'Join channel success',
  JOIN_FAILED = 'Join channel failed',
  REJOIN = 'Perform join operation again',
  LEAVE = 'Leave channel success',

  INVALID_TOKEN = 'Invalid token',
  TOKEN_EXPIRED = 'Token expired',
  INCONSISTENT_APP_ID = 'Inconsistent app ID',
  INVALID_CHANNEL_NAME = 'Invalid channel name',
  INVALID_USER_ID = 'Invalid user id',
  NOT_INITIALIZED = 'Not initialized',
  RTM_SERVICE_NOT_CONNECTED = 'RTM service not connected',
  CHANNEL_INSTANCE_EXCEED_LIMITATION = 'Channel instance exceed limitation',
  OPERATION_RATE_EXCEED_LIMITATION = 'Operation rate exceed limitation',
  CHANNEL_IN_ERROR_STATE = 'Channel in error state',
  PRESENCE_NOT_CONNECTED = 'Presence not connected',

  SAME_UID_LOGIN = 'The same uid login on another device',
  KICKED_OUT_BY_SERVER = 'Kicked out by server',
  KEEP_ALIVE_TIMEOUT = 'Keep alive timeout',
  CONNECTION_ERROR = 'Connection error',
  PRESENCE_NOT_READY = 'Presence not ready',
  NETWORK_CHANGE = 'Network change',
  SERVICE_NOT_SUPPORTED = 'Service not supported',
  STREAM_CHANNEL_NOT_AVAILABLE = 'Stream channel not available',
  STORAGE_NOT_AVAILABLE = 'Storage service is not available',
  LOCK_NOT_AVAILABLE = 'Lock service is not available',
  LOGIN_TOO_FREQUENT = 'Login too frequent',
}

export enum ChannelTypeEnum {
  MESSAGE = 1,
  STREAM = 2,
  USER = 3,
}
