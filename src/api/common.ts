export interface BaseResponse {
  timestamp: number;
}

/** @zh-cn
 * @hidden
 */
/**
 * @hidden
 */
export interface LogFilterType {
  error: boolean;
  warn: boolean;
  info: boolean;
  track: boolean;
  debug: boolean;
}

/** @zh-cn
 * {@link RTMClient} 对象的配置参数。
 *
 * 可在初始化时通过 {@link new RTM} 的第 3 个参数或实例上的 {@link updateConfig} 方法进行设置。
 */
/**
 * Interface holding the configuration of an `RTMClient` instance.
 *
 * You can pass it as the third argument when calling the {@link new RTM} method, or use it when calling the {@link updateConfig} method.
 */

export interface PrivateInstanceConfig {
  /** @zh-cn
   * 是否上传日志。默认关闭。
   * - `true`: 启用日志上传；
   * - `false`: （默认）关闭日志上传。
   */
  /**
   * Whether to enable log upload. It is set to `false` by default.
   * - `true`: Enable log upload,
   * - `false`: (Default) Disable log upload.
   */
  logUpload?: boolean;
  logFilter?: LogFilterType;

  /**
   * Whether to enable cloud proxy.
   */
  cloudProxy?: boolean;
}

/**@zh-cn
 * 频道类型。
 * - `STREAM`: STREAM CHANNEL 频道；
 * - `MESSAGE`: MESSAGE CHANNEL 频道；
 * - `USEr`: 私密频道。
 */
/**
 * Channel type.
 * - `STREAM`: STREAM CHANNEL;
 * - `MESSAGE`: MESSAGE CHANNEL;
 * - `USEr`: PRIVATE CHANNEL.
 */
export type ChannelType = 'STREAM' | 'MESSAGE' | 'USER';

/**@zh-cn
 * 服务类型。
 * - `MESSAGE`: RTM 基础服务；
 * - `STREAM`: STREAM CHANNEL 服务。
 */
/**
 * Service type.
 * - `MESSAGE`: RTM basic service;
 * - `STREAM`: STREAM CHANNEL service.
 */
export type ServiceType = 'MESSAGE' | 'STREAM';

export interface ConsoleConfig {
  '-': number; // VendorID
  'app_key': string; // AppKey
  'region': string; // Region
  'enabled': string; // Enabled
  'presence.occupancy': string; // PresenceOccupancy
  'presence.interval': string; // PresenceInterval
  'presence.debounce': string; // PresenceDebounce
  'storage.enabled': string; // StorageEnabled
  'storage.channel_subscribe_enabled': string; // StorageChannelSubscribeEnabled
  'storage.user_subscribe_enabled': string; // StorageUserSubscribeEnabled
  'lock.enabled': string; // LockEnabled
  'history.enabled': string; // HistoryEnabled
}

/**
 * @internal
 */
export type SubscribeState = 'SUBSCRIBED' | 'SUBSCRIBING';

/**@internal */
export const defaultSubscribeOptions = {
  withLock: false,
  withMessage: true,
  withMetadata: false,
  withPresence: true,
  beQuiet: false,
};
