import { RTM_CHANNEL_TYPE } from '../AgoraRtmBase';
import { IRtmStorage, MetadataOptions, RtmMetadata } from '../IAgoraRtmStorage';

// @ts-ignore
export class IRtmStorageImpl implements IRtmStorage {
  createMetadata(): RtmMetadata {
    const apiType = this.getApiTypeFromCreateMetadata();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromCreateMetadata(): string {
    return 'RtmStorage_createMetadata';
  }

  setChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    data: RtmMetadata,
    options: MetadataOptions,
    lockName: string
  ): number {
    const apiType = this.getApiTypeFromSetChannelMetadata(
      channelName,
      channelType,
      data,
      options,
      lockName
    );
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      data: data,
      options: options,
      lockName: lockName,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
          data: data,
          options: options,
          lockName: lockName,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    const requestId = jsonResults.requestId;
    return requestId;
  }

  protected getApiTypeFromSetChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    data: RtmMetadata,
    options: MetadataOptions,
    lockName: string
  ): string {
    return 'RtmStorage_setChannelMetadata';
  }

  updateChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    data: RtmMetadata,
    options: MetadataOptions,
    lockName: string
  ): number {
    const apiType = this.getApiTypeFromUpdateChannelMetadata(
      channelName,
      channelType,
      data,
      options,
      lockName
    );
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      data: data,
      options: options,
      lockName: lockName,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
          data: data,
          options: options,
          lockName: lockName,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    const requestId = jsonResults.requestId;
    return requestId;
  }

  protected getApiTypeFromUpdateChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    data: RtmMetadata,
    options: MetadataOptions,
    lockName: string
  ): string {
    return 'RtmStorage_updateChannelMetadata';
  }

  removeChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    data: RtmMetadata,
    options: MetadataOptions,
    lockName: string
  ): number {
    const apiType = this.getApiTypeFromRemoveChannelMetadata(
      channelName,
      channelType,
      data,
      options,
      lockName
    );
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      data: data,
      options: options,
      lockName: lockName,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
          data: data,
          options: options,
          lockName: lockName,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    const requestId = jsonResults.requestId;
    return requestId;
  }

  protected getApiTypeFromRemoveChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    data: RtmMetadata,
    options: MetadataOptions,
    lockName: string
  ): string {
    return 'RtmStorage_removeChannelMetadata';
  }

  getChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE
  ): number {
    const apiType = this.getApiTypeFromGetChannelMetadata(
      channelName,
      channelType
    );
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    const requestId = jsonResults.requestId;
    return requestId;
  }

  protected getApiTypeFromGetChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE
  ): string {
    return 'RtmStorage_getChannelMetadata';
  }

  setUserMetadata(
    userId: string,
    data: RtmMetadata,
    options: MetadataOptions
  ): number {
    const apiType = this.getApiTypeFromSetUserMetadata(userId, data, options);
    const jsonParams = {
      userId: userId,
      data: data,
      options: options,
      toJSON: () => {
        return {
          userId: userId,
          data: data,
          options: options,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    const requestId = jsonResults.requestId;
    return requestId;
  }

  protected getApiTypeFromSetUserMetadata(
    userId: string,
    data: RtmMetadata,
    options: MetadataOptions
  ): string {
    return 'RtmStorage_setUserMetadata';
  }

  updateUserMetadata(
    userId: string,
    data: RtmMetadata,
    options: MetadataOptions
  ): number {
    const apiType = this.getApiTypeFromUpdateUserMetadata(
      userId,
      data,
      options
    );
    const jsonParams = {
      userId: userId,
      data: data,
      options: options,
      toJSON: () => {
        return {
          userId: userId,
          data: data,
          options: options,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    const requestId = jsonResults.requestId;
    return requestId;
  }

  protected getApiTypeFromUpdateUserMetadata(
    userId: string,
    data: RtmMetadata,
    options: MetadataOptions
  ): string {
    return 'RtmStorage_updateUserMetadata';
  }

  removeUserMetadata(
    userId: string,
    data: RtmMetadata,
    options: MetadataOptions
  ): number {
    const apiType = this.getApiTypeFromRemoveUserMetadata(
      userId,
      data,
      options
    );
    const jsonParams = {
      userId: userId,
      data: data,
      options: options,
      toJSON: () => {
        return {
          userId: userId,
          data: data,
          options: options,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    const requestId = jsonResults.requestId;
    return requestId;
  }

  protected getApiTypeFromRemoveUserMetadata(
    userId: string,
    data: RtmMetadata,
    options: MetadataOptions
  ): string {
    return 'RtmStorage_removeUserMetadata';
  }

  getUserMetadata(userId: string): number {
    const apiType = this.getApiTypeFromGetUserMetadata(userId);
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

  protected getApiTypeFromGetUserMetadata(userId: string): string {
    return 'RtmStorage_getUserMetadata';
  }

  subscribeUserMetadata(userId: string): number {
    const apiType = this.getApiTypeFromSubscribeUserMetadata(userId);
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

  protected getApiTypeFromSubscribeUserMetadata(userId: string): string {
    return 'RtmStorage_subscribeUserMetadata';
  }

  unsubscribeUserMetadata(userId: string): number {
    const apiType = this.getApiTypeFromUnsubscribeUserMetadata(userId);
    const jsonParams = {
      userId: userId,
      toJSON: () => {
        return {
          userId: userId,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromUnsubscribeUserMetadata(userId: string): string {
    return 'RtmStorage_unsubscribeUserMetadata';
  }
}

import { callIrisApi } from '../internal/IrisRtmEngine';
