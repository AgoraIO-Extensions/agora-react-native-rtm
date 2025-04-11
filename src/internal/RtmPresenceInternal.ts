import { ChannelType } from '../api';
import {
  GetOnlineUsersOptions,
  GetOnlineUsersResponse,
  GetStateResponse,
  GetUserChannelsResponse,
  RTMPresence,
  RemoveStateOptions,
  RemoveStateResponse,
  SetStateResponse,
  StateDetail,
  WhereNowResponse,
  WhoNowOptions,
  WhoNowResponse,
} from '../api/RTMPresence';

export class RtmPresenceInternal extends RTMPresence {
  whoNow(
    channelName: string,
    channelType: ChannelType,
    options?: WhoNowOptions
  ): Promise<WhoNowResponse> {
    throw new Error('Method not implemented.');
  }
  getOnlineUsers(
    channelName: string,
    channelType: ChannelType,
    options?: GetOnlineUsersOptions
  ): Promise<GetOnlineUsersResponse> {
    throw new Error('Method not implemented.');
  }
  whereNow(userId: string): Promise<WhereNowResponse> {
    throw new Error('Method not implemented.');
  }
  getUserChannels(userId: string): Promise<GetUserChannelsResponse> {
    throw new Error('Method not implemented.');
  }
  setState(
    channelName: string,
    channelType: ChannelType,
    state: StateDetail
  ): Promise<SetStateResponse> {
    throw new Error('Method not implemented.');
  }
  getState(
    userId: string,
    channelName: string,
    channelType: ChannelType
  ): Promise<GetStateResponse> {
    throw new Error('Method not implemented.');
  }
  removeState(
    channelName: string,
    channelType: ChannelType,
    options?: RemoveStateOptions
  ): Promise<RemoveStateResponse> {
    throw new Error('Method not implemented.');
  }
  constructor() {
    super();
  }
}
