import { PublishOptions, SubscribeOptions } from '../legacy/AgoraRtmBase';

import { RTMClientEventMap } from './RTMEvents';
import { RTMHistory } from './RTMHistory';
import { RTMLock } from './RTMLock';
import { RTMPresence } from './RTMPresence';
import { RTMStorage } from './RTMStorage';
import { RTMStreamChannel } from './RTMStreamChannel';
import { BaseResponse } from './common';

export type ErrorInfo = {
  error: boolean;
  reason: string;
  operation: string;
  errorCode: number;
};
export type RTMOperationResponse = BaseResponse & {
  channelName: string;
};
export type SubscribeResponse = RTMOperationResponse;
export type UnsubscribeResponse = RTMOperationResponse;
export type LoginResponse = BaseResponse;
export type LogoutResponse = BaseResponse;
export type PublishResponse = RTMOperationResponse;
export type RenewTokenResponse = BaseResponse;
export type UpdateConfigResponse = BaseResponse;

export interface LoginOptions {
  token?: string;
}

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
