import { BaseResponse, ChannelType } from './common';

export interface StateDetail {
  [key: string]: string;
}
export interface OccupancyDetail {
  // 目前 state value 只支持 string 类型
  /**@zh-cn
   * 用户临时状态，目前仅支持 key，value 均为 string 类型的键值对。
   */
  /**
   * The temporary state of the user. Currently, only key-value pairs of string type are supported.
   */
  states: StateDetail;
  /**@zh-cn
   * 用户 ID。
   */
  userId: string;
  /**@zh-cn
   * 用户临时状态的数量。
   */
  /**
   * The number of temporary states of the user.
   */
  statesCount: number;
}

export interface WhoNowResponse extends BaseResponse {
  // 频道用户在线人数
  /**@zh-cn
   * 当前频道内的用户总数。
   * @note 如果 whoNow 查询结果被分页，返回的结果中 totalOccupancy 为当前页的用户总数，不是整个频道的用户总数。
   */
  /**
   * The total number of users in the current channel.
   * @note If the result of whoNow is paginated, the totalOccupancy in the returned result is the total number of users on the current page, not the total number of users in the entire channel.
   */
  totalOccupancy: number;
  /**@zh-cn
   * 当前频道内的用户列表，详见 {@link OccupancyDetail}。
   */
  /**
   * The user list in the current channel. See {@link OccupancyDetail}.
   */
  occupants: OccupancyDetail[];
  /**@zh-cn
   * 下一页的页码，如果当前页是最后一页，返回的结果中 nextPage 为空字符串。
   * @note 当 nextPage 不为空字符串时，下次调用 whoNow 时，需要传入这个值，否则会返回相同的结果。
   */
  /**
   * The page number of the next page. If the current page is the last page, nextPage in the returned result is an empty string.
   * @note When nextPage is not an empty string, you need to pass in this value when calling whoNow next time, otherwise the same result will be returned.
   */
  nextPage: string;
}
export interface GetOnlineUsersResponse extends WhoNowResponse {}

// uid: false, state: false => 当前频道用户数
// uid: false, state: true => error: 参数无效
// uid: true, state: false => 当前频道内的用户列表
// uid: true, state: true => 当前频道内用户列表及临时状态
export interface WhoNowOptions {
  /**@zh-cn
   * 是否包含用户 ID，如果设置为 false，返回的结果中用户列表为空，默认为 `true`。
   */
  /**
   * Whether to include the user ID. If set as `false`, the user list in the returned result is empty. The default value is `true`.
   */
  includedUserId?: boolean;
  // 默认false
  /**@zh-cn
   * 是否包含用户的临时状态，如果设置为 false，返回的结果中每个用户的 state 都为空对象，设置为 true 时，会携带每个用户设置的 state，默认为 `false`。
   */
  /**
   * Whether to include the user's temporary state. If set as `false`, the state of each user in the returned result is an empty object. If set as `true`, the state set by each user is carried. The default value is `false`.
   */
  includedState?: boolean;
  /**@zh-cn
   * 每页返回指定的用户数量，这个值需要在声网控制台中设置，默认为 50。如果当前频道内的用户数量超过了这个值，返回结果中 nextPage 会得到一个值，用于获取下一页的数据。
   * @note 该参数仅在 includedUserId 为 true 时有效。
   * @note 当 {@link WhoNowResponse} 的 nextPage 的值不为空字符串时，下次调用 whoNow 时，需要传入这个值，否则会返回相同的结果。
   */
  /**
   * The number of users returned per page. This value needs to be set in the Agora Console and is set as 50 by default. If the number of users in the current channel exceeds this value, the value of nextPage in the returned result is obtained to get the data of the next page.
   * @note This parameter is valid only when includedUserId is set as `true`.
   * @note When the value of nextPage in {@link WhoNowResponse} is not an empty string, you need to pass in this value when calling whoNow next time, otherwise the same result will be returned.
   */
  page?: string;
}

export interface GetOnlineUsersOptions extends WhoNowOptions {}

export interface ChannelDetail {
  channelName: string;
  channelType: ChannelType;
}

export interface WhereNowResponse extends BaseResponse {
  /**@zh-cn
   * 用户加入的频道列表。
   */
  /**
   * The list of channels that the user has joined.
   */
  channels: ChannelDetail[];
  /**@zh-cn
   * 用户加入的频道数量。
   */
  /**
   * The number of channels that the user has joined.
   */
  totalChannel: number;
}

export interface GetUserChannelsResponse extends WhereNowResponse {}

export interface SetStateResponse extends BaseResponse {}

export interface GetStateResponse extends OccupancyDetail, BaseResponse {
  /**@zh-cn
   * 用户临时状态的数量。
   */
  /**
   * The number of temporary states of the user.
   */
  statesCount: number;
  /**@zh-cn
   * 用户临时状态，目前仅支持 key，value 均为 string 类型的键值对。
   */
  /**
   * The temporary state of the user. Currently, only key-value pairs of string type are supported.
   */
  states: StateDetail;
  /**
   * The user ID.
   */
  userId: string;
}

export interface RemoveStateResponse extends BaseResponse {}

export interface RemoveStateOptions {
  states?: string[];
}
export abstract class RTMPresence {
  abstract whoNow(
    channelName: string,
    channelType: ChannelType,
    options?: WhoNowOptions
  ): Promise<WhoNowResponse>;
  abstract getOnlineUsers(
    channelName: string,
    channelType: ChannelType,
    options?: GetOnlineUsersOptions
  ): Promise<GetOnlineUsersResponse>;

  abstract whereNow(userId: string): Promise<WhereNowResponse>;
  abstract getUserChannels(userId: string): Promise<GetUserChannelsResponse>;

  abstract setState(
    channelName: string,
    channelType: ChannelType,
    state: StateDetail
  ): Promise<SetStateResponse>;

  abstract getState(
    userId: string,
    channelName: string,
    channelType: ChannelType
  ): Promise<GetStateResponse>;

  abstract removeState(
    channelName: string,
    channelType: ChannelType,
    // 传入 state key, 不传代表全部删除
    options?: RemoveStateOptions
  ): Promise<RemoveStateResponse>;
}
