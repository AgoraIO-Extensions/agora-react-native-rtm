import {
  LoginOptions,
  LoginResponse,
  LogoutResponse,
  PublishResponse,
  RTMClient,
  RenewTokenOptions,
  RenewTokenResponse,
  SubscribeResponse,
  UnsubscribeResponse,
} from '../api/RTMClient';
import { RTMClientEventMap } from '../api/RTMEvents';
import { RTMHistory } from '../api/RTMHistory';
import { RTMLock } from '../api/RTMLock';
import { RTMPresence } from '../api/RTMPresence';
import { RTMStorage } from '../api/RTMStorage';
import { RTMStreamChannel } from '../api/RTMStreamChannel';
import { PublishOptions, SubscribeOptions } from '../legacy/AgoraRtmBase';
import { RtmConfig } from '../legacy/IAgoraRtmClient';
import { IRtmClientImpl } from '../legacy/impl/IAgoraRtmClientImpl';

import {
  DeviceEventEmitter,
  EVENT_TYPE,
  EventProcessor,
  callIrisApi,
  handleError,
  wrapRtmResult,
} from './IrisRtmEngine';
import { RtmHistoryInternal } from './RtmHistoryInternal';
import { RtmLockInternal } from './RtmLockInternal';
import { RtmPresenceInternal } from './RtmPresenceInternal';
import { RtmStorageInternal } from './RtmStorageInternal';
import { StreamChannelInternal } from './StreamChannelInternal';

export class RtmClientInternal extends RTMClient {
  private _rtmClientImpl: IRtmClientImpl = new IRtmClientImpl();
  static _event_handlers: RTMClientEventMap[] = [];
  public presence: RTMPresence = new RtmPresenceInternal();
  public storage: RTMStorage = new RtmStorageInternal();
  public lock: RTMLock = new RtmLockInternal();
  public history: RTMHistory = new RtmHistoryInternal();
  static _streamChannels: Map<string, StreamChannelInternal> = new Map();

  private event_name_map = {
    linkState: 'onLinkStateEvent',
    presence: 'onPresenceEvent',
    message: 'onMessageEvent',
    storage: 'onStorageEvent',
    lock: 'onLockEvent',
    topic: 'onTopicEvent',
    tokenPrivilegeWillExpire: 'onTokenPrivilegeWillExpire',
  };

  constructor(config: RtmConfig) {
    super();
    if (config?.eventHandler) {
      Object.entries(config.eventHandler).forEach(([key, value]) => {
        this.addEventListener(key as keyof RTMClientEventMap, value);
      });
    }
    const jsonParams = {
      config: config,
      toJSON: () => {
        return {
          config: config,
        };
      },
    };
    callIrisApi.call(this, 'RtmClient_create', jsonParams);
  }

  createStreamChannel(channelName: string): RTMStreamChannel {
    const streamChannel = new StreamChannelInternal(channelName);
    RtmClientInternal._streamChannels.set(channelName, streamChannel);
    this._rtmClientImpl.createStreamChannel(channelName);
    return streamChannel;
  }

  release(): number {
    RtmClientInternal._event_handlers = [];
    this.removeAllListeners();
    const ret = this._rtmClientImpl.release();
    return ret;
  }

  addEventListener<EventType extends keyof RTMClientEventMap>(
    eventType: EventType,
    listener: RTMClientEventMap[EventType]
  ): void {
    const callback = (eventProcessor: EventProcessor<any>, data: any) => {
      if (eventProcessor.type(data) !== EVENT_TYPE.RTMEvent) {
        return;
      }
      eventProcessor.func.map((it) => {
        it({ [eventType]: listener }, eventType, data);
      });
    };
    // @ts-ignore
    listener!.agoraCallback = callback;
    const eventName = this.event_name_map[eventType] || eventType;
    DeviceEventEmitter.addListener(eventName, callback);
  }

  removeEventListener<EventType extends keyof RTMClientEventMap>(
    eventType: EventType,
    listener?: RTMClientEventMap[EventType]
  ) {
    DeviceEventEmitter.removeListener(
      eventType,
      // @ts-ignore
      listener?.agoraCallback ?? listener
    );
  }

  removeAllListeners<EventType extends keyof RTMClientEventMap>(
    eventType?: EventType
  ) {
    RtmClientInternal._event_handlers = [];
    DeviceEventEmitter.removeAllListeners(eventType);
  }

  async login(options?: LoginOptions): Promise<LoginResponse> {
    const token = options?.token || '';
    let operation = 'login';
    let callBack = 'onLoginResult';
    try {
      const status = this._rtmClientImpl.login(token);
      let result = await wrapRtmResult(status, operation, callBack);
      return result;
    } catch (error) {
      throw handleError(error, operation);
    }
  }

  async logout(): Promise<LogoutResponse> {
    let operation = 'logout';
    let callBack = 'onLogoutResult';
    try {
      const status = this._rtmClientImpl.logout();
      let result = await wrapRtmResult(status, operation, callBack);
      return result;
    } catch (error) {
      throw handleError(error, operation);
    }
  }

  async publish(
    channelName: string,
    message: string | Uint8Array,
    options?: PublishOptions
  ): Promise<PublishResponse> {
    let operation = 'publish';
    let callBack = 'onPublishResult';
    try {
      const status = this._rtmClientImpl.publish(
        channelName,
        message,
        message.length,
        options!
      );
      let result = await wrapRtmResult(status, operation, callBack);
      return {
        ...result,
        channelName,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async subscribe(
    channelName: string,
    options?: SubscribeOptions
  ): Promise<SubscribeResponse> {
    let operation = 'subscribe';
    let callBack = 'onSubscribeResult';
    try {
      const status = this._rtmClientImpl.subscribe(channelName, options!);
      let result = await wrapRtmResult(status, operation, callBack);
      return {
        ...result,
        channelName,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async unsubscribe(channelName: string): Promise<UnsubscribeResponse> {
    let operation = 'unsubscribe';
    let callBack = 'onUnsubscribeResult';
    try {
      const status = this._rtmClientImpl.unsubscribe(channelName);
      let result = await wrapRtmResult(status, operation, callBack);
      return {
        ...result,
        channelName,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async renewToken(
    token: string,
    options?: RenewTokenOptions
  ): Promise<RenewTokenResponse> {
    let operation = 'renewToken';
    let callBack = 'onRenewTokenResult';

    try {
      if (!options) {
        const status = this._rtmClientImpl.renewToken(token);
        let result = await wrapRtmResult(status, operation, callBack);
        return result;
      } else {
        const channelName = options.channelName;
        if (!channelName) {
          throw handleError(new Error('Channel name is required'), operation);
        }
        if (!RtmClientInternal._streamChannels.has(channelName)) {
          throw handleError(new Error('Stream channel not found'), operation);
        }
        const status = RtmClientInternal._streamChannels
          .get(channelName)!
          .renewToken(token);
        let result = await wrapRtmResult(status, operation, callBack);
        return result;
      }
    } catch (error) {
      throw handleError(error, operation);
    }
  }
}
