import {
  ChannelInfo,
  PresenceOptions,
  RTM_CHANNEL_TYPE,
  StateItem,
  UserState,
} from '../legacy/AgoraRtmBase';

import { BaseResponse } from './common';

export type WhoNowResponse = BaseResponse & {
  totalOccupancy: number;
  occupants: UserState[];
  nextPage: string;
};
export type GetOnlineUsersResponse = WhoNowResponse;

export type WhereNowResponse = BaseResponse & {
  channels: ChannelInfo[];
  totalChannel: number;
};

export type GetUserChannelsResponse = WhereNowResponse;

export type SetStateResponse = BaseResponse;

export type GetStateResponse = UserState & BaseResponse;

export type RemoveStateResponse = BaseResponse;

export interface RemoveStateOptions {
  states?: string[];
}
export abstract class RTMPresence {
  abstract whoNow(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    options?: PresenceOptions
  ): Promise<WhoNowResponse>;
  abstract getOnlineUsers(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    options?: PresenceOptions
  ): Promise<GetOnlineUsersResponse>;

  abstract whereNow(userId: string): Promise<WhereNowResponse>;
  abstract getUserChannels(userId: string): Promise<GetUserChannelsResponse>;

  abstract setState(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    state: StateItem
  ): Promise<SetStateResponse>;

  abstract getState(
    userId: string,
    channelName: string,
    channelType: RTM_CHANNEL_TYPE
  ): Promise<GetStateResponse>;

  abstract removeState(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    // 传入 state key, 不传代表全部删除
    options?: RemoveStateOptions
  ): Promise<RemoveStateResponse>;
}
