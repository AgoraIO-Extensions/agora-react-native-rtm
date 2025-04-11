import { BaseResponse, ChannelType } from './common';

/**@zh-cn
 * 元数据项的定义。
 */
/**
 * the define of metadata's item.
 */
export interface MetadataItem {
  /**@zh-cn
   * 元数据项的名称。
   */
  /**
   * Name of metadata item.
   */
  key: string;
  /**@zh-cn
   * 元数据项的值。
   */
  /**
   * Value of metadata item.
   */
  value: string;
  /**@zh-cn
   * 元数据项的版本号。
   * -1 表示此属性可竞争读写最后更新者得，
   * 0 表示此属性只有在不存在时才创建，
   * 正整数表示只有版本号匹配时此属性才能被操作成功。
   */
  /**
   * Revision of metadata item. It is set to `-1` by default.
   * @default -1
   */
  revision?: number;
}

export interface StorageData {
  /**@zh-cn
   * 此频道包含的属性组个数。
   */
  /**
   * The number of attribute groups contained in the channel.
   */
  totalCount: number;
  /**@zh-cn
   * 元数据的总版本号。
   */
  /**
   * The Revision of metadata.
   */
  majorRevision: number;
  /**@zh-cn
   * 元数据的信息。
   */
  /**
   * The infos of metadata.
   */
  metadata: Record<string, MetaDataDetail>;
}

export interface ChannelMetadataOperationResponse extends BaseResponse {
  channelName: string;
  channelType: ChannelType;
}

export interface UserMetadataOperationResponse extends BaseResponse {
  userId: string;
}

export interface SetChannelMetadataResponse
  extends ChannelMetadataOperationResponse {
  /**@zh-cn
   * 此频道包含的属性组个数。
   */
  /**
   * The number of attribute groups contained in the channel.
   */
  totalCount: number;
}

export interface SetUserMetadataResponse extends UserMetadataOperationResponse {
  /**@zh-cn
   * 此用户的属性组个数。
   */
  /**
   * The number of attribute groups of the user.
   */
  totalCount: number;
}

export interface UpdateChannelMetadataResponse
  extends ChannelMetadataOperationResponse {
  /**@zh-cn
   * 此频道包含的属性组个数。
   */
  /**
   * The number of attribute groups contained in the channel.
   */
  totalCount: number;
}

export interface UpdateUserMetadataResponse
  extends UserMetadataOperationResponse {
  /**@zh-cn
   * 此用户的属性组个数。
   */
  /**
   * The number of attribute groups of the user.
   */
  totalCount: number;
}

export interface MetaDataDetail {
  /**@zh-cn
   * 元数据项的值。
   */
  /**
   * Value of metadata item.
   */
  value: string;
  /**@zh-cn
   * 元数据项的版本号。
   */
  /**
   * Revision of metadata item.
   */
  revision: number;
  /**@zh-cn
   * 元数据项最后一次被修改的时间戳。
   */
  /**
   * The timestamp when the metadata item was last modified.
   */
  updated: number;
  /**@zh-cn
   * 最后一次修改元数据项的用户。
   */
  /**
   * The user who last modified the metadata item.
   */
  authorUid: string;
}

export interface GetChannelMetadataResponse
  extends StorageData,
    ChannelMetadataOperationResponse {}

export interface GetUserMetadataResponse
  extends StorageData,
    UserMetadataOperationResponse {}

export interface RemoveChannelMetadataResponse
  extends ChannelMetadataOperationResponse {
  /**@zh-cn
   * 此频道包含的属性组个数。
   */
  /**
   * The number of attribute groups contained in the channel.
   */
  totalCount: number;
}

export interface RemoveUserMetadataResponse
  extends UserMetadataOperationResponse {
  /**@zh-cn
   * 此用户的属性组个数。
   */
  /**
   * The number of attribute groups of the user.
   */
  totalCount: number;
}

export interface SubscribeUserMetaResponse
  extends UserMetadataOperationResponse {}
export interface UnsubscribeUserMetaResponse
  extends UserMetadataOperationResponse {}

export interface MetadataOptions {
  /**@zh-cn
   * 元数据的总版本号。
   * -1 表示此属性可竞争读写最后更新者得，
   * 0 表示此属性只有在不存在时才创建，
   * 正整数表示只有版本号匹配时此属性才能被操作成功。
   */
  /**
   * Revision of metadata. It is set to `1` by default.
   * @default -1
   */
  majorRevision?: number;
  /**@zh-cn
   * 分布式锁名称。如果设置，只有获得此锁的用户才有权限进行操作。
   */
  /**
   * Distributed lock name. If set, only the user who has acquired this lock will have permission to perform the operation. It is set to `''` by default.
   * @default ''
   */
  lockName?: string;
  /**@zh-cn
   * 本次操作是否在每个属性中添加服务器时间戳。
   */
  /**
   * Whether this operation adds server timestamp to each attribute. It is set to `false` by default.
   * @default false
   */
  addTimeStamp?: boolean;
  /**@zh-cn
   * 本次操作是否在每个属性中添加编辑者id。
   */
  /**
   * Whether to add editor id to each property in this operation. It is set to `false` by default.
   * @default false
   */
  addUserId?: boolean;
}

export interface RemoveUserMetadataOptions extends MetadataOptions {
  // 指定需要删除属性的用户，不传此字段默认删除用户自己的属性
  /**
   * A user that needs to be specified. If you don't provide, this param default value is yourself.
   */
  userId?: string;
  // 需要删除的用户属性，不传此字段将删除所有
  /**
   * the items user wants to operate, each item must has unique key. If you don't provide this param, default clear all items. The item type please see {@link MetadataItem}.
   */
  data?: MetadataItem[];
}

export interface RemoveChannelMetadataOptions extends MetadataOptions {
  // 需要删除的频道属性，不传此字段将删除所有
  /**
   * the items user wants to operate, each item must has unique key. If you don't provide this param, default clear all items. The item type please see {@link MetadataItem}.
   */
  data?: MetadataItem[];
}

export interface SetOrUpdateUserMetadataOptions extends MetadataOptions {
  // 指定需要设置/更新属性的用户，不传此字段默认设置用户自己的属性
  /**
   * A user that needs to be specified. If you don't provide, this param default value is yourself.
   */
  userId?: string;
}

export interface GetUserMetadataOptions {
  userId?: string;
}

export abstract class RTMStorage {
  /**@zh-cn
   * 设置频道的元数据项。
   *
   */
  /**
   * set the metadata of a specific channel.
   *
   * @param channelName A channel that needs to be specified.
   * @param channelType channelType for this channel. See {@link ChannelType}
   * @param data the items user wants to operate, each item must has unique key. The item type please see {@link MetadataItem}.
   * @param options Options for this metadata operation. See {@link MetadataOptions}.
   */
  abstract setChannelMetadata(
    channelName: string,
    channelType: ChannelType,
    data: MetadataItem[],
    options?: MetadataOptions
  ): Promise<SetChannelMetadataResponse>;

  /**@zh-cn
   * 获取指定频道的元数据项。
   *
   */
  /**
   * get all metadata items of the channel.
   *
   * @param channelName A channel that needs to be specified.
   * @param channelType channelType for this channel. See {@link ChannelType}
   */
  abstract getChannelMetadata(
    channelName: string,
    channelType: ChannelType
  ): Promise<GetChannelMetadataResponse>;

  /**@zh-cn
   * 删除频道的元数据项。
   *
   */
  /**
   * delete metadata items of the channel.
   *
   * @param channelName A channel that needs to be specified.
   * @param channelType channelType for this channel. See {@link ChannelType}
   * @param options Options for this metadata operation. See {@link RemoveChannelMetadataOptions}.
   */
  abstract removeChannelMetadata(
    channelName: string,
    channelType: ChannelType,
    options?: RemoveChannelMetadataOptions
  ): Promise<RemoveChannelMetadataResponse>;

  /**@zh-cn
   * 更新指定频道的元数据项。
   *
   */
  /**
   * Update metadata items of the channel.
   *
   * @param channelName A channel that needs to be specified.
   * @param channelType channelType for this channel. See {@link ChannelType}
   * @param data the items user wants to operate, each item must has unique key. The item type please see {@link MetadataItem}.
   * @param options Options for this metadata operation. See {@link MetadataOptions}.
   */
  abstract updateChannelMetadata(
    channelName: string,
    channelType: ChannelType,
    data: MetadataItem[],
    options?: MetadataOptions
  ): Promise<UpdateChannelMetadataResponse>;

  /**@zh-cn
   * 设置指定用户的元数据项。如果用户之前没有属性，则自动创建用户属性。如果用户之前已有属性，将会根据需要设置的每组属性中"name"字段进行检索，如果原本用户属性中有"name"属性组则覆盖，如果没有则追加。
   *
   */
  /**
   * Set a specific user’s metadata. Automatically creates user attributes if the user has no attributes before. If the user has an attribute before, it will be retrieved according to the "name" field in each set of attributes that needs to be set. If there is a "name" attribute group in the original user attribute, it will be overwritten, and if not, it will be appended.
   *
   * @param data the items user wants to operate, each item must has unique key. The item type please see {@link MetadataItem}.
   * @param options Options for this metadata operation. See {@link SetOrUpdateUserMetadataOptions}.
   */
  abstract setUserMetadata(
    data: MetadataItem[],
    options?: SetOrUpdateUserMetadataOptions
  ): Promise<SetUserMetadataResponse>;

  /**@zh-cn
   * 获取指定用户的用户元数据项。
   *
   */
  /**
   * Get the user’s metadata of a specified user.
   * @param userId The userId of the user logging in the Agora RTM system.
   */
  abstract getUserMetadata(
    options?: GetUserMetadataOptions
  ): Promise<GetUserMetadataResponse>;

  /**@zh-cn
   * 删除指定用户的元数据项。
   *
   */
  /**
   * Delete a specific user’s metadata items.
   *
   * @param options Options for this metadata operation. See {@link RemoveUserMetadataOptions}.
   *
   */
  abstract removeUserMetadata(
    options?: RemoveUserMetadataOptions
  ): Promise<RemoveUserMetadataResponse>;

  /**@zh-cn
   * 更新指定用户的元数据项。
   *
   */
  /**
   * Update a specific user’s metadata items.
   *
   * @param data the items user wants to operate, each item must has unique key. The item type please see {@link MetadataItem}.
   * @param options Options for this metadata operation. See {@link SetOrUpdateUserMetadataOptions}.
   */
  abstract updateUserMetadata(
    data: MetadataItem[],
    options?: SetOrUpdateUserMetadataOptions
  ): Promise<UpdateUserMetadataResponse>;

  // 放入storage
  /**@zh-cn
   * 订阅特定用户的用户元数据更新事件。
   *
   */
  /**
   * Subscribe to user metadata update events for a specific users.
   * @param userId The userId of the user logging in the Agora RTM system.
   */
  abstract subscribeUserMetadata(
    userId: string
  ): Promise<SubscribeUserMetaResponse>;

  /**@zh-cn
   * 取消订阅特定用户的用户元数据更新事件。
   *
   */
  /**
   * Unsubscribe to user metadata update events for a specific users.
   * @param userId The userId of the user logging in the Agora RTM system.
   */
  abstract unsubscribeUserMetadata(
    userId: string
  ): Promise<UnsubscribeUserMetaResponse>;
}
