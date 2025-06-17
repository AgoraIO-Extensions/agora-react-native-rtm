import { RtmChannelType } from '../legacy/AgoraRtmBase';
import { Metadata } from '../legacy/IAgoraRtmStorage';

import { BaseResponse } from './RTMClient';

export type ChannelMetadataOperationResponse = BaseResponse & {
  channelName: string;
  channelType: RtmChannelType;
};

export type UserMetadataOperationResponse = BaseResponse & {
  userId: string;
};

export type SetChannelMetadataResponse = ChannelMetadataOperationResponse;

export type SetUserMetadataResponse = UserMetadataOperationResponse;

export type UpdateChannelMetadataResponse = ChannelMetadataOperationResponse;

export type UpdateUserMetadataResponse = UserMetadataOperationResponse;

export type GetChannelMetadataResponse = Metadata &
  ChannelMetadataOperationResponse;

export type GetUserMetadataResponse = Metadata & UserMetadataOperationResponse;

export type RemoveChannelMetadataResponse = ChannelMetadataOperationResponse;

export type RemoveUserMetadataResponse = UserMetadataOperationResponse;

export type SubscribeUserMetaResponse = UserMetadataOperationResponse;

export type UnsubscribeUserMetaResponse = UserMetadataOperationResponse;

export interface IMetadataOptions {
  majorRevision?: number;
  lockName?: string;
  addTimeStamp?: boolean;
  addUserId?: boolean;
}

export interface RemoveUserMetadataOptions extends IMetadataOptions {
  userId?: string;
  data?: Metadata;
}

export interface RemoveChannelMetadataOptions extends IMetadataOptions {
  data?: Metadata;
}

export interface SetOrUpdateUserMetadataOptions extends IMetadataOptions {
  userId?: string;
}

export interface GetUserMetadataOptions {
  userId?: string;
}

export abstract class RTMStorage {
  abstract setChannelMetadata(
    channelName: string,
    channelType: RtmChannelType,
    data: Metadata,
    options?: IMetadataOptions
  ): Promise<SetChannelMetadataResponse>;
  abstract getChannelMetadata(
    channelName: string,
    channelType: RtmChannelType
  ): Promise<GetChannelMetadataResponse>;
  abstract removeChannelMetadata(
    channelName: string,
    channelType: RtmChannelType,
    options?: RemoveChannelMetadataOptions
  ): Promise<RemoveChannelMetadataResponse>;
  abstract updateChannelMetadata(
    channelName: string,
    channelType: RtmChannelType,
    data: Metadata,
    options?: IMetadataOptions
  ): Promise<UpdateChannelMetadataResponse>;
  abstract setUserMetadata(
    data: Metadata,
    options?: SetOrUpdateUserMetadataOptions
  ): Promise<SetUserMetadataResponse>;
  abstract getUserMetadata(
    options?: GetUserMetadataOptions
  ): Promise<GetUserMetadataResponse>;
  abstract removeUserMetadata(
    options?: RemoveUserMetadataOptions
  ): Promise<RemoveUserMetadataResponse>;
  abstract updateUserMetadata(
    data: Metadata,
    options?: SetOrUpdateUserMetadataOptions
  ): Promise<UpdateUserMetadataResponse>;
  abstract subscribeUserMetadata(
    userId: string
  ): Promise<SubscribeUserMetaResponse>;
  abstract unsubscribeUserMetadata(
    userId: string
  ): Promise<UnsubscribeUserMetaResponse>;
}
