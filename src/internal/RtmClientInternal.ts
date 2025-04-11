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

    // 先调用原生方法获取 requestId
    const requestId = this._rtmClientImpl.login(token);
    console.log('requestId', requestId);
    // 使用获取到的 requestId 创建请求
    let result = await RequestQueue.instance.addRequest(
      'onLoginResult',
      10000,
      requestId
    );

    console.log('result4442424', result);

    // 等待回调解析 Promise
    try {
      // await request;
      console.log(545454);
      return { timestamp: Date.now() };
    } catch (error) {
      return { timestamp: Date.now() };
    }
  }

  async logout(): Promise<LogoutResponse> {
    // 先调用原生方法获取 requestId
    const requestId = this._rtmClientImpl.logout();

    // 使用获取到的 requestId 创建请求
    const request = RequestQueue.instance.addRequest(
      'onLogoutResult',
      10000,
      requestId
    );

    // 等待回调解析 Promise
    try {
      await request;
      return { timestamp: Date.now() };
    } catch (error) {
      return { timestamp: Date.now() };
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
