import { PublishOptions, SubscribeOptions } from '../legacy/AgoraRtmBase';

import { RTMClientEventMap } from './RTMEvents';
import { RTMHistory } from './RTMHistory';
import { RTMLock } from './RTMLock';
import { RTMPresence } from './RTMPresence';
import { RTMStorage } from './RTMStorage';
import { RTMStreamChannel } from './RTMStreamChannel';
import { BaseResponse, LogFilterType, ServiceType } from './common';

export interface LogFilterLevel {
  /** @zh-cn
   * 不输出日志信息。
   */
  /**
   * Do not output any log information.
   */
  LOG_FILTER_NONE: LogFilterType;
  /** @zh-cn
   * 输出 ERROR 级别的日志信息。
   */
  /**
   * Output ERROR level log information.
   */
  LOG_FILTER_ERROR: LogFilterType;
  /** @zh-cn
   * 输出 ERROR 和 WARNING 级别的日志信息。
   */
  /**
   * Output WARNING and INFO level log information.
   */
  LOG_FILTER_WARN: LogFilterType;
  /** @zh-cn
   * 输出 ERROR、WARNING 和 INFO 级别的日志信息。 我们推荐你将日志级别设为该等级。
   */
  /**
   * Output ERROR, WARNING, and INFO level log information.
   */
  LOG_FILTER_INFO: LogFilterType;
  /**
   * @ignore
   */
  LOG_FILTER_DEBUG: LogFilterType;
}

export interface PrivateConfig {
  /**@zh-cn
   * 支持的服务类型，详见 {@link ServiceType}。
   * @note 请不要随意修改该配置，否则可能导致 SDK 无法正常工作。
   * @example
   * ```javascript
   * // 支持使用 RTM 基础功能与 STREAM CHANNEL 功能
   * privateConfig.serviceType = ['MESSAGE', 'STREAM'];
   * // 仅支持使用 RTM 基础功能，创建 STREAM CHANNEL 会失败
   * privateConfig.serviceType = ['MESSAGE'];
   * // 仅支持使用 STREAM CHANNEL 功能，登录 RTM 会失败
   * privateConfig.serviceType = ['STREAM'];
   * ```
   */
  /**
   * Supported service types, see {@link ServiceType}.
   * @note Please do not modify this configuration at will, otherwise the SDK may not work properly.
   * @example
   * ```javascript
   * // Support using RTM basic functions and STREAM CHANNEL functions
   * privateConfig.serviceType = ['MESSAGE', 'STREAM'];
   * // Only support using RTM basic functions, creating STREAM CHANNEL will fail
   * privateConfig.serviceType = ['MESSAGE'];
   * // Only support using STREAM CHANNEL functions, login RTM will fail
   * privateConfig.serviceType = ['STREAM'];
   * ```
   */
  serviceType: ServiceType[];
  /**@zh-cn
   * 用于登录时分配 RTM 基础服务和 STREAM CHANNEL 服务的域名列表。
   * @note 配置的域名所在的机器需要能够分配 RTM 和 STREAM CHANNEL两种服务。
   */
  /**
   * The list of domains used to assign RTM basic services and STREAM CHANNEL services when logging in.
   * @note The machine where the configured domain is located needs to be able to assign two services: RTM and STREAM CHANNEL.
   */
  accessPointHosts: string[];
  /**@zh-cn
   * 使用 SDK 期间产生的事件上传的主机列表。
   */
  /**
   * The list of hosts to which events generated during the use of the SDK are uploaded.
   */
  eventUploadHosts?: string[]; // [main, backup]
  /**@zh-cn
   * 使用 SDK 期间产生的日志上传的主机列表。
   */
  /**
   * The list of hosts to which logs generated during the use of the SDK are uploaded.
   */
  logUploadHosts?: string[]; // [main, backup]
  /**@zh-cn
   * 连接 RTM 基础服务时使用的后缀域名列表。
   * @note 请求 {@link accessPointHosts} 时获取到的 RTM 基础服务的 ip 为 `xxx.xxx.xxx.xxx`，则使用 `xxx-xxx-xxx-xxx.{@link originDomains}` 连接 RTM 基础服务。
   */
  /**
   * The list of suffix domains used when connecting to RTM basic services.
   * @note If the IP of the RTM basic service obtained when requesting {@link accessPointHosts} is `xxx.xxx.xxx.xxx`, use `xxx-xxx-xxx-xxx.${originDomains}` to connect to the RTM basic service.
   */
  originDomains?: string[]; // [main, backup]
}

export interface LoginOptions {
  /** @zh-cn
   * 登录 RTM 的 Token, 若您的项目开启了 App 证书，您必须要提供 Token 才能成功登录, 一般由您的服务端获取。
   */
  /**
   * The Token used to log in to the Agora RTM system. If your project has enabled App Certificate, you must provide a Token to log in successfully, generally obtained from your app server.
   */
  token?: string;
}

export interface RTMOperationResponse extends BaseResponse {
  channelName: string;
}
export type SubscribeResponse = RTMOperationResponse | ErrorInfo;
export type UnsubscribeResponse = RTMOperationResponse | ErrorInfo;
export type LoginResponse = BaseResponse | ErrorInfo;
export type LogoutResponse = BaseResponse | ErrorInfo;
export type PublishResponse = RTMOperationResponse | ErrorInfo;

export type RenewTokenResponse = BaseResponse | ErrorInfo;
export type UpdateConfigResponse = BaseResponse | ErrorInfo;
export interface RenewTokenOptions {
  channelName?: string;
}

export abstract class RTMClient {
  abstract presence: RTMPresence;
  abstract history: RTMHistory;
  abstract storage: RTMStorage;
  abstract lock: RTMLock;

  abstract addEventListener<EventType extends keyof RTMClientEventMap>(
    eventType: EventType,
    listener: RTMClientEventMap[EventType]
  ): void;

  abstract removeEventListener<EventType extends keyof RTMClientEventMap>(
    eventType: EventType,
    listener?: RTMClientEventMap[EventType]
  ): void;

  abstract removeAllListeners<EventType extends keyof RTMClientEventMap>(
    eventType?: EventType
  ): void;

  abstract login(options?: LoginOptions): Promise<LoginResponse>;

  abstract logout(): Promise<LogoutResponse>;

  abstract release(): number;

  abstract publish(
    channelName: string,
    message: string | Uint8Array,
    options?: PublishOptions
  ): Promise<PublishResponse>;

  abstract subscribe(
    channelName: string,
    options?: SubscribeOptions
  ): Promise<SubscribeResponse>;

  abstract unsubscribe(channelName: string): Promise<UnsubscribeResponse>;

  abstract createStreamChannel(channelName: string): RTMStreamChannel;

  abstract renewToken(
    token: string,
    options?: RenewTokenOptions
  ): Promise<RenewTokenResponse>;
}

// rtm 所有的错误都会按照此定义抛出
export interface ErrorInfo {
  error: boolean;
  reason: string;
  operation: string;
  errorCode: number;
}
