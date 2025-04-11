import {
  IRtmClientEvent,
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
import { RTMHistory } from '../api/RTMHistory';
import { RTMLock } from '../api/RTMLock';
import { RTMPresence } from '../api/RTMPresence';
import { RTMStorage } from '../api/RTMStorage';
import { RTMStreamChannel } from '../api/RTMStreamChannel';
import { PublishOptions, SubscribeOptions } from '../legacy/AgoraRtmBase';
import { IRtmEventHandler, RtmConfig } from '../legacy/IAgoraRtmClient';
import { IRtmHistory } from '../legacy/IAgoraRtmHistory';
import { IRtmLock } from '../legacy/IAgoraRtmLock';
import { IRtmPresence } from '../legacy/IAgoraRtmPresence';
import { IRtmStorage } from '../legacy/IAgoraRtmStorage';
import { IStreamChannel } from '../legacy/IAgoraStreamChannel';
import { IRtmClientImpl } from '../legacy/impl/IAgoraRtmClientImpl';

import {
  DeviceEventEmitter,
  EVENT_TYPE,
  EventProcessor,
  RequestQueue,
  callIrisApi,
} from './IrisRtmEngine';
import { RtmHistoryInternal } from './RtmHistoryInternal';
import { RtmLockInternal } from './RtmLockInternal';
import { RtmPresenceInternal } from './RtmPresenceInternal';
import { RtmStorageInternal } from './RtmStorageInternal';
import { StreamChannelInternal } from './StreamChannelInternal';

export class RtmClientInternal extends RTMClient {
  private _rtmClientImpl: IRtmClientImpl = new IRtmClientImpl();
  static _event_handlers: IRtmEventHandler[] = [];
  public presence: RTMPresence = new RtmPresenceInternal();
  public storage: RTMStorage = new RtmStorageInternal();
  public lock: RTMLock = new RtmLockInternal();
  public history: RTMHistory = new RtmHistoryInternal();

  constructor(config: RtmConfig) {
    super();
    if (config?.eventHandler) {
      Object.entries(config.eventHandler).forEach(([key, value]) => {
        this.addEventListener(key as keyof IRtmClientEvent, value);
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
    // const result = super.createStreamChannel(channelName);
    return new StreamChannelInternal(channelName);
  }

  release(): number {
    RtmClientInternal._event_handlers = [];
    this.removeAllListeners();
    const ret = this._rtmClientImpl.release();
    return ret;
  }

  addEventListener<EventType extends keyof IRtmClientEvent>(
    eventType: EventType,
    listener: IRtmClientEvent[EventType]
  ): void {
    const callback = (eventProcessor: EventProcessor<any>, data: any) => {
      if (eventProcessor.type(data) !== EVENT_TYPE.IRtmClient) {
        return;
      }
      eventProcessor.func.map((it) => {
        it({ [eventType]: listener }, eventType, data);
      });
    };
    // @ts-ignore
    listener!.agoraCallback = callback;
    DeviceEventEmitter.addListener(eventType, callback);
  }

  removeEventListener<EventType extends keyof IRtmClientEvent>(
    eventType: EventType,
    listener?: IRtmClientEvent[EventType]
  ) {
    DeviceEventEmitter.removeListener(
      eventType,
      // @ts-ignore
      listener?.agoraCallback ?? listener
    );
  }

  removeAllListeners<EventType extends keyof IRtmClientEvent>(
    eventType?: EventType
  ) {
    RtmClientInternal._event_handlers = [];
    DeviceEventEmitter.removeAllListeners(eventType);
  }

  async login(options?: LoginOptions | undefined): Promise<LoginResponse> {
    const token = options?.token || '';
    try {
      const requestId = this._rtmClientImpl.login(token);
      const result = await RequestQueue.instance.addRequest(
        'onLoginResult',
        10000,
        requestId
      );
      return result;
    } catch (error) {
      return {
        error: true,
        reason: '登录失败',
        operation: 'login',
        errorCode: 1,
      };
    }
  }

  async logout(): Promise<LogoutResponse> {
    try {
      const requestId = this._rtmClientImpl.logout();
      const result = await RequestQueue.instance.addRequest(
        'onLogoutResult',
        10000,
        requestId
      );
      return result;
    } catch (error) {
      return {
        error: true,
        reason: '登出失败',
        operation: 'logout',
        errorCode: 1,
      };
    }
  }

  publish(
    channelName: string,
    message: string | Uint8Array,
    options?: PublishOptions
  ): Promise<PublishResponse> {
    throw new Error('Method not implemented.');
  }
  subscribe(
    channelName: string,
    options?: SubscribeOptions
  ): Promise<SubscribeResponse> {
    throw new Error('Method not implemented.');
  }
  unsubscribe(channelName: string): Promise<UnsubscribeResponse> {
    throw new Error('Method not implemented.');
  }
  renewToken(
    token: string,
    options?: RenewTokenOptions
  ): Promise<RenewTokenResponse> {
    throw new Error('Method not implemented.');
  }
}
