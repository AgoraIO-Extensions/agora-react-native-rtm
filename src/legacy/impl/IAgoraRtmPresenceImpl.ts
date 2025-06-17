import { callIrisApi } from '../../internal/IrisRtmEngine';
import {
  GetOnlineUsersOptions,
  PresenceOptions,
  RtmChannelType,
  StateItem,
} from '../AgoraRtmBase';
import { IRtmPresence } from '../IAgoraRtmPresence';

// @ts-ignore
export class IRtmPresenceImpl implements IRtmPresence {
  whoNow(
    channelName: string,
    channelType: RtmChannelType,
    options: PresenceOptions
  ): any {
    const apiType = this.getApiTypeFromWhoNow(
      channelName,
      channelType,
      options
    );
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      options: options,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
          options: options,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromWhoNow(
    channelName: string,
    channelType: RtmChannelType,
    options: PresenceOptions
  ): string {
    return 'RtmPresence_whoNow_f7f61d1';
  }

  whereNow(userId: string): any {
    const apiType = this.getApiTypeFromWhereNow(userId);
    const jsonParams = {
      userId: userId,
      toJSON: () => {
        return {
          userId: userId,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromWhereNow(userId: string): string {
    return 'RtmPresence_whereNow_1fa04dd';
  }

  setState(
    channelName: string,
    channelType: RtmChannelType,
    items: StateItem[],
    count: number
  ): any {
    const apiType = this.getApiTypeFromSetState(
      channelName,
      channelType,
      items,
      count
    );
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      items: items,
      count: count,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
          items: items,
          count: count,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromSetState(
    channelName: string,
    channelType: RtmChannelType,
    items: StateItem[],
    count: number
  ): string {
    return 'RtmPresence_setState_b73723a';
  }

  removeState(
    channelName: string,
    channelType: RtmChannelType,
    keys: string[],
    count: number
  ): any {
    const apiType = this.getApiTypeFromRemoveState(
      channelName,
      channelType,
      keys,
      count
    );
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      keys: keys,
      count: count,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
          keys: keys,
          count: count,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromRemoveState(
    channelName: string,
    channelType: RtmChannelType,
    keys: string[],
    count: number
  ): string {
    return 'RtmPresence_removeState_d7033d8';
  }

  getState(
    channelName: string,
    channelType: RtmChannelType,
    userId: string
  ): any {
    const apiType = this.getApiTypeFromGetState(
      channelName,
      channelType,
      userId
    );
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      userId: userId,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
          userId: userId,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromGetState(
    channelName: string,
    channelType: RtmChannelType,
    userId: string
  ): string {
    return 'RtmPresence_getState_4ffa44d';
  }

  getOnlineUsers(
    channelName: string,
    channelType: RtmChannelType,
    options: GetOnlineUsersOptions
  ): any {
    const apiType = this.getApiTypeFromGetOnlineUsers(
      channelName,
      channelType,
      options
    );
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      options: options,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
          options: options,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromGetOnlineUsers(
    channelName: string,
    channelType: RtmChannelType,
    options: GetOnlineUsersOptions
  ): string {
    return 'RtmPresence_getOnlineUsers_ce2d8e8';
  }

  getUserChannels(userId: string): any {
    const apiType = this.getApiTypeFromGetUserChannels(userId);
    const jsonParams = {
      userId: userId,
      toJSON: () => {
        return {
          userId: userId,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromGetUserChannels(userId: string): string {
    return 'RtmPresence_getUserChannels_1fa04dd';
  }
}
