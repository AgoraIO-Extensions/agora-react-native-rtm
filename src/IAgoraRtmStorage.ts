import { RTM_CHANNEL_TYPE } from './AgoraRtmBase';

/// Generated by terra, DO NOT MODIFY BY HAND.

/**
 * Metadata options.
 */
export class MetadataOptions {
  recordTs?: boolean = false;
  recordUserId?: boolean = false;
  constructor(
    props?: Partial<{
      recordTs?: boolean;
      recordUserId?: boolean;
    }>
  ) {
    Object.assign(this, props);
  }
}

export class MetadataItem {
  key?: string;
  value?: string;
  authorUserId?: string;
  revision?: number = -1;
  updateTs?: number = 0;
  constructor(
    props?: Partial<{
      key?: string;
      value?: string;
      authorUserId?: string;
      revision?: number;
      updateTs?: number;
    }>
  ) {
    Object.assign(this, props);
  }
}

export abstract class IMetadata {
  abstract setMajorRevision(revision: number): void;
  abstract getMajorRevision(): number;
  abstract setMetadataItem(item: MetadataItem): void;
  abstract getMetadataItems(items: MetadataItem[], size: number): void;
  abstract clearMetadata(): void;
  abstract release(): void;
}

export abstract class IRtmStorage {
  abstract createMetadata(): IMetadata[];
  abstract setChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    data: IMetadata,
    options: MetadataOptions,
    lockName: string,
    requestId?: number
  ): number;
  abstract updateChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    data: IMetadata,
    options: MetadataOptions,
    lockName: string,
    requestId?: number
  ): number;
  abstract removeChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    data: IMetadata,
    options: MetadataOptions,
    lockName: string,
    requestId?: number
  ): number;
  abstract getChannelMetadata(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    requestId?: number
  ): number;
  abstract setUserMetadata(
    userId: string,
    data: IMetadata,
    options: MetadataOptions,
    requestId?: number
  ): number;
  abstract updateUserMetadata(
    userId: string,
    data: IMetadata,
    options: MetadataOptions,
    requestId?: number
  ): number;
  abstract removeUserMetadata(
    userId: string,
    data: IMetadata,
    options: MetadataOptions,
    requestId?: number
  ): number;
  abstract getUserMetadata(userId: string, requestId?: number): number;
  abstract subscribeUserMetadata(userId: string, requestId?: number): number;
  abstract unsubscribeUserMetadata(userId: string): number;
}
