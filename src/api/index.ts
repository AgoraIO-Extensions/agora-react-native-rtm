import { RTMClient } from './RTMClient';
import * as ConstantsType from './constants/rtm-enum';

export declare interface IAgoraRTM {
  /** @zh-cn
   * Agora RTM SDK 的编译信息。
   */
  /**
   * Compilation information of the Agora RTM SDK.
   * @example `AgoraRTM.BUILD`
   */
  BUILD: string;

  RTM: RTMClient;

  /** @zh-cn
   * Agora RTM SDK 的版本号。
   */
  /**
   * Version of the Agora RTM SDK.
   * @example `AgoraRTM.VERSION`
   */
  VERSION: string;

  processId: string;

  setArea({
    areaCodes,
    excludedArea,
  }: {
    areaCodes: ConstantsType.AreaCode[];
    excludedArea?: ConstantsType.AreaCode;
  }): void;

  constantsType: typeof ConstantsType;
}

declare const AgoraRTM: IAgoraRTM;

export default AgoraRTM;

export type {
  ChannelDetail,
  GetStateResponse,
  GetUserChannelsResponse,
  OccupancyDetail,
  RTMPresence,
  RemoveStateResponse,
  SetStateResponse,
  StateDetail,
  WhereNowResponse,
  WhoNowOptions,
  WhoNowResponse,
  GetOnlineUsersOptions,
  GetOnlineUsersResponse,
  RemoveStateOptions,
} from './RTMPresence';
export type {
  ChannelMetadataOperationResponse,
  GetChannelMetadataResponse,
  GetUserMetadataResponse,
  MetaDataDetail,
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
  StorageData,
  SubscribeUserMetaResponse,
  UnsubscribeUserMetaResponse,
  UpdateChannelMetadataResponse,
  UpdateUserMetadataResponse,
  UserMetadataOperationResponse,
  GetUserMetadataOptions,
} from './RTMStorage';
export type {
  GetSubscribedUserListResponse,
  JoinChannelResponse,
  JoinTopicResponse,
  LeaveChannelResponse,
  LeaveTopicResponse,
  PublishTopicMessageResponse,
  RTMStreamChannel,
  RTMStreamChannelStatusCode,
  StreamChannelOperationResponse,
  SubscribeTopicResponse,
  SubscribedFailedReason,
  UnsubscribeTopicResponse,
  JoinOptions,
  joinTopicOptions,
  PublishTopicMessageOptions,
} from './RTMStreamChannel';
export type {
  AcquireLockResponse,
  GetLockResponse,
  LockDetail,
  LockOperationResponse,
  RTMLock,
  ReleaseLockResponse,
  RemoveLockResponse,
  RevokeLockResponse,
  SetLockResponse,
  SetLockOptions,
  AcquireLockOptions,
} from './RTMLock';
export type {
  GetHistoryMessageOptions,
  GetMessagesResponse,
  HistoryChannelType,
  HistoryMessage,
  RTMHistory,
} from './RTMHistory';
export type {
  ErrorInfo,
  LoginResponse,
  LogoutResponse,
  PublishResponse,
  RTMClient,
  RTMOperationResponse,
  RenewTokenResponse,
  SubscribeResponse,
  UnsubscribeResponse,
  UpdateConfigResponse,
  PrivateConfig,
  RenewTokenOptions,
} from './RTMClient';
export type { BaseResponse, ChannelType, ServiceType } from './common';
export type { ConstantsType };
