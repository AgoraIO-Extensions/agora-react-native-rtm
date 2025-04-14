import {
  LinkStateEvent,
  LockEvent,
  MessageEvent,
  PresenceEvent,
  StorageEvent,
  TopicEvent,
} from '../legacy/IAgoraRtmClient';

export interface RTMClientEventMap {
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

export function processRTMClientEventMap(
  handler: RTMClientEventMap,
  event: string,
  jsonParams: any
) {
  switch (event) {
    case 'presence':
      if (handler.presence !== undefined) {
        handler.presence(jsonParams.event);
      }
      break;
    case 'message':
      if (handler.message !== undefined) {
        handler.message(jsonParams.event);
      }
      break;
    case 'storage':
      if (handler.storage !== undefined) {
        handler.storage(jsonParams.event);
      }
      break;
    case 'lock':
      if (handler.lock !== undefined) {
        handler.lock(jsonParams.event);
      }
      break;
    case 'topic':
      if (handler.topic !== undefined) {
        handler.topic(jsonParams.event);
      }
      break;
    case 'tokenPrivilegeWillExpire':
      if (handler.tokenPrivilegeWillExpire !== undefined) {
        handler.tokenPrivilegeWillExpire(jsonParams.channelName);
      }
      break;
    case 'linkState':
      if (handler.linkState !== undefined) {
        handler.linkState(jsonParams.event);
      }
      break;
  }
}
