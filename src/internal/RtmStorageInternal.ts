import { ChannelType } from '../api';
import {
  GetChannelMetadataResponse,
  GetUserMetadataOptions,
  GetUserMetadataResponse,
  MetadataItem,
  MetadataOptions,
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

export class RtmStorageInternal extends RTMStorage {
  setChannelMetadata(
    channelName: string,
    channelType: ChannelType,
    data: MetadataItem[],
    options?: MetadataOptions
  ): Promise<SetChannelMetadataResponse> {
    throw new Error('Method not implemented.');
  }
  getChannelMetadata(
    channelName: string,
    channelType: ChannelType
  ): Promise<GetChannelMetadataResponse> {
    throw new Error('Method not implemented.');
  }
  removeChannelMetadata(
    channelName: string,
    channelType: ChannelType,
    options?: RemoveChannelMetadataOptions
  ): Promise<RemoveChannelMetadataResponse> {
    throw new Error('Method not implemented.');
  }
  updateChannelMetadata(
    channelName: string,
    channelType: ChannelType,
    data: MetadataItem[],
    options?: MetadataOptions
  ): Promise<UpdateChannelMetadataResponse> {
    throw new Error('Method not implemented.');
  }
  setUserMetadata(
    data: MetadataItem[],
    options?: SetOrUpdateUserMetadataOptions
  ): Promise<SetUserMetadataResponse> {
    throw new Error('Method not implemented.');
  }
  getUserMetadata(
    options?: GetUserMetadataOptions
  ): Promise<GetUserMetadataResponse> {
    throw new Error('Method not implemented.');
  }
  removeUserMetadata(
    options?: RemoveUserMetadataOptions
  ): Promise<RemoveUserMetadataResponse> {
    throw new Error('Method not implemented.');
  }
  updateUserMetadata(
    data: MetadataItem[],
    options?: SetOrUpdateUserMetadataOptions
  ): Promise<UpdateUserMetadataResponse> {
    throw new Error('Method not implemented.');
  }
  subscribeUserMetadata(userId: string): Promise<SubscribeUserMetaResponse> {
    throw new Error('Method not implemented.');
  }
  unsubscribeUserMetadata(
    userId: string
  ): Promise<UnsubscribeUserMetaResponse> {
    throw new Error('Method not implemented.');
  }
  constructor() {
    super();
  }
}
