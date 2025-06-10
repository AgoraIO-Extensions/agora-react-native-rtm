import { callIrisApi } from '../../internal/IrisRtmEngine';
import { RTM_CHANNEL_TYPE } from '../AgoraRtmBase';
import { IRtmStorage, Metadata, MetadataOptions } from '../IAgoraRtmStorage';

// @ts-ignore
export class IRtmStorageImpl implements IRtmStorage {
  setChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    data: Metadata,
    options: MetadataOptions,
    lockName: string
  ): any {
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
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromSetChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    data: Metadata,
    options: MetadataOptions,
    lockName: string
  ): string {
    return 'RtmStorage_setChannelMetadata_55e6d00';
  }

  updateChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    data: Metadata,
    options: MetadataOptions,
    lockName: string
  ): any {
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
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromUpdateChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    data: Metadata,
    options: MetadataOptions,
    lockName: string
  ): string {
    return 'RtmStorage_updateChannelMetadata_55e6d00';
  }

  removeChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    data: Metadata,
    options: MetadataOptions,
    lockName: string
  ): any {
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
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromRemoveChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    data: Metadata,
    options: MetadataOptions,
    lockName: string
  ): string {
    return 'RtmStorage_removeChannelMetadata_55e6d00';
  }

  getChannelMetadata(channelName: string, channelType: RTM_CHANNEL_TYPE): any {
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
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromGetChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE
  ): string {
    return 'RtmStorage_getChannelMetadata_ad8568b';
  }

  setUserMetadata(
    userId: string,
    data: Metadata,
    options: MetadataOptions
  ): any {
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
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromSetUserMetadata(
    userId: string,
    data: Metadata,
    options: MetadataOptions
  ): string {
    return 'RtmStorage_setUserMetadata_24ae125';
  }

  updateUserMetadata(
    userId: string,
    data: Metadata,
    options: MetadataOptions
  ): any {
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
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromUpdateUserMetadata(
    userId: string,
    data: Metadata,
    options: MetadataOptions
  ): string {
    return 'RtmStorage_updateUserMetadata_24ae125';
  }

  removeUserMetadata(
    userId: string,
    data: Metadata,
    options: MetadataOptions
  ): any {
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
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromRemoveUserMetadata(
    userId: string,
    data: Metadata,
    options: MetadataOptions
  ): string {
    return 'RtmStorage_removeUserMetadata_24ae125';
  }

  getUserMetadata(userId: string): any {
    const apiType = this.getApiTypeFromGetUserMetadata(userId);
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

  protected getApiTypeFromGetUserMetadata(userId: string): string {
    return 'RtmStorage_getUserMetadata_1fa04dd';
  }

  subscribeUserMetadata(userId: string): any {
    const apiType = this.getApiTypeFromSubscribeUserMetadata(userId);
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

  protected getApiTypeFromSubscribeUserMetadata(userId: string): string {
    return 'RtmStorage_subscribeUserMetadata_1fa04dd';
  }

  unsubscribeUserMetadata(userId: string): any {
    const apiType = this.getApiTypeFromUnsubscribeUserMetadata(userId);
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

  protected getApiTypeFromUnsubscribeUserMetadata(userId: string): string {
    return 'RtmStorage_unsubscribeUserMetadata_1fa04dd';
  }
}
