import {
  GetChannelMetadataResponse,
  GetUserMetadataOptions,
  GetUserMetadataResponse,
  IMetadataOptions,
  RTMStorage,
  RemoveChannelMetadataOptions,
  RemoveChannelMetadataResponse,
  RemoveUserMetadataOptions,
  RemoveUserMetadataResponse,
  SetChannelMetadataResponse,
  SetOrUpdateUserMetadataOptions,
  SetUserMetadataResponse,
  SubscribeUserMetaResponse,
  UnsubscribeUserMetaResponse,
  UpdateChannelMetadataResponse,
  UpdateUserMetadataResponse,
} from '../api/RTMStorage';
import { RTM_CHANNEL_TYPE } from '../legacy/AgoraRtmBase';
import { Metadata } from '../legacy/IAgoraRtmStorage';
import { MetadataOptions } from '../legacy/IAgoraRtmStorage';
import { IRtmStorageImpl } from '../legacy/impl/IAgoraRtmStorageImpl';

import { handleError, wrapRtmResult } from './IrisRtmEngine';

export class RtmStorageInternal extends RTMStorage {
  private _rtmStorageImpl: IRtmStorageImpl = new IRtmStorageImpl();

  async setChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    data: Metadata,
    options?: IMetadataOptions
  ): Promise<SetChannelMetadataResponse> {
    let operation = 'setChannelMetadata';
    let callBack = 'onSetChannelMetadataResult';
    try {
      const status = this._rtmStorageImpl.setChannelMetadata(
        channelName,
        channelType,
        data,
        new MetadataOptions({
          recordTs: options?.addTimeStamp,
          recordUserId: options?.addUserId,
        }),
        options?.lockName ?? ''
      );
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        channelName: result.callBackResult?.channelName,
        channelType: result.callBackResult?.channelType,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async getChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE
  ): Promise<GetChannelMetadataResponse> {
    let operation = 'getChannelMetadata';
    let callBack = 'onGetChannelMetadataResult';
    try {
      const status = this._rtmStorageImpl.getChannelMetadata(
        channelName,
        channelType
      );
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        channelName: result.callBackResult?.channelName,
        channelType: result.callBackResult?.channelType,
        majorRevision: result.callBackResult?.data?.majorRevision,
        items: result.callBackResult?.data?.items,
        itemCount: result.callBackResult?.data?.itemCount,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async removeChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    options?: RemoveChannelMetadataOptions
  ): Promise<RemoveChannelMetadataResponse> {
    let operation = 'removeChannelMetadata';
    let callBack = 'onRemoveChannelMetadataResult';
    try {
      const status = this._rtmStorageImpl.removeChannelMetadata(
        channelName,
        channelType,
        options?.data ?? new Metadata(),
        new MetadataOptions({
          recordTs: options?.addTimeStamp,
          recordUserId: options?.addUserId,
        }),
        options?.lockName ?? ''
      );
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        channelName: result.callBackResult?.channelName,
        channelType: result.callBackResult?.channelType,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async updateChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    data: Metadata,
    options?: IMetadataOptions
  ): Promise<UpdateChannelMetadataResponse> {
    let operation = 'updateChannelMetadata';
    let callBack = 'onUpdateChannelMetadataResult';
    try {
      const status = this._rtmStorageImpl.updateChannelMetadata(
        channelName,
        channelType,
        data,
        new MetadataOptions({
          recordTs: options?.addTimeStamp,
          recordUserId: options?.addUserId,
        }),
        options?.lockName ?? ''
      );
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        channelName: result.callBackResult?.channelName,
        channelType: result.callBackResult?.channelType,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async setUserMetadata(
    data: Metadata,
    options?: SetOrUpdateUserMetadataOptions
  ): Promise<SetUserMetadataResponse> {
    let operation = 'setUserMetadata';
    let callBack = 'onSetUserMetadataResult';
    try {
      const status = this._rtmStorageImpl.setUserMetadata(
        options?.userId ?? '',
        data,
        new MetadataOptions({
          recordTs: options?.addTimeStamp,
          recordUserId: options?.addUserId,
        })
      );
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        userId: result.callBackResult?.userId,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async getUserMetadata(
    options?: GetUserMetadataOptions
  ): Promise<GetUserMetadataResponse> {
    let operation = 'getUserMetadata';
    let callBack = 'onGetUserMetadataResult';
    try {
      const status = this._rtmStorageImpl.getUserMetadata(
        options?.userId ?? ''
      );
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        userId: result.callBackResult?.userId,
        majorRevision: result.callBackResult?.data?.majorRevision,
        items: result.callBackResult?.data?.items,
        itemCount: result.callBackResult?.data?.itemCount,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async updateUserMetadata(
    data: Metadata,
    options?: SetOrUpdateUserMetadataOptions
  ): Promise<UpdateUserMetadataResponse> {
    let operation = 'updateUserMetadata';
    let callBack = 'onUpdateUserMetadataResult';
    try {
      const status = this._rtmStorageImpl.updateUserMetadata(
        options?.userId ?? '',
        data,
        new MetadataOptions({
          recordTs: options?.addTimeStamp,
          recordUserId: options?.addUserId,
        })
      );
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        userId: result.callBackResult?.userId,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async subscribeUserMetadata(
    userId: string
  ): Promise<SubscribeUserMetaResponse> {
    let operation = 'subscribeUserMetadata';
    let callBack = 'onSubscribeUserMetadataResult';
    try {
      const status = this._rtmStorageImpl.subscribeUserMetadata(userId);
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        userId: result.callBackResult?.userId,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async unsubscribeUserMetadata(
    userId: string
  ): Promise<UnsubscribeUserMetaResponse> {
    let operation = 'unsubscribeUserMetadata';
    let callBack = 'onUnsubscribeUserMetadataResult';
    try {
      const status = this._rtmStorageImpl.unsubscribeUserMetadata(userId);
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        userId: result.callBackResult?.userId,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }

  async removeUserMetadata(
    options?: RemoveUserMetadataOptions
  ): Promise<RemoveUserMetadataResponse> {
    let operation = 'removeUserMetadata';
    let callBack = 'onRemoveUserMetadataResult';
    try {
      const status = this._rtmStorageImpl.removeUserMetadata(
        options?.userId ?? '',
        options?.data ?? new Metadata(),
        new MetadataOptions({
          recordTs: options?.addTimeStamp,
          recordUserId: options?.addUserId,
        })
      );
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        userId: result.callBackResult?.userId,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
}
