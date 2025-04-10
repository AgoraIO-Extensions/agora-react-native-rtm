import {
  GetOnlineUsersOptions,
  PresenceOptions,
  RTM_CHANNEL_TYPE,
  StateItem,
} from '../AgoraRtmBase';
import { IRtmPresence } from '../IAgoraRtmPresence';

// @ts-ignore
export class IRtmPresenceImpl implements IRtmPresence {
  whoNow(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    options: PresenceOptions
  ): number {
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
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    const requestId = jsonResults.requestId;
    return requestId;
  }

  protected getApiTypeFromWhoNow(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    options: PresenceOptions
  ): string {
    return 'RtmPresence_whoNow_f7f61d1';
  }

  whereNow(userId: string): number {
    const apiType = this.getApiTypeFromWhereNow(userId);
    const jsonParams = {
      userId: userId,
      toJSON: () => {
        return {
          userId: userId,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    const requestId = jsonResults.requestId;
    return requestId;
  }

  protected getApiTypeFromWhereNow(userId: string): string {
    return 'RtmPresence_whereNow_1fa04dd';
  }

  setState(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    items: StateItem[],
    count: number
  ): number {
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
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    const requestId = jsonResults.requestId;
    return requestId;
  }

  protected getApiTypeFromSetState(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    items: StateItem[],
    count: number
  ): string {
    return 'RtmPresence_setState_b73723a';
  }

  removeState(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    keys: string[],
    count: number
  ): number {
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
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    const requestId = jsonResults.requestId;
    return requestId;
  }

  protected getApiTypeFromRemoveState(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    keys: string[],
    count: number
  ): string {
    return 'RtmPresence_removeState_d7033d8';
  }

  getState(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    userId: string
  ): number {
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
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    const requestId = jsonResults.requestId;
    return requestId;
  }

  protected getApiTypeFromGetState(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    userId: string
  ): string {
    return 'RtmPresence_getState_4ffa44d';
  }

  getOnlineUsers(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    options: GetOnlineUsersOptions
  ): number {
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
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    const requestId = jsonResults.requestId;
    return requestId;
  }

  protected getApiTypeFromGetOnlineUsers(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    options: GetOnlineUsersOptions
  ): string {
    return 'RtmPresence_getOnlineUsers_ce2d8e8';
  }

  getUserChannels(userId: string): number {
    const apiType = this.getApiTypeFromGetUserChannels(userId);
    const jsonParams = {
      userId: userId,
      toJSON: () => {
        return {
          userId: userId,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    const requestId = jsonResults.requestId;
    return requestId;
  }

  protected getApiTypeFromGetUserChannels(userId: string): string {
    return 'RtmPresence_getUserChannels_1fa04dd';
  }
}

import { callIrisApi } from '../internal/IrisRtmEngine';
