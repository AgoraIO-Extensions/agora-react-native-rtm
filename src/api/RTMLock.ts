import { LockDetail, RTM_CHANNEL_TYPE } from '../legacy/AgoraRtmBase';

import { BaseResponse } from './RTMClient';

export interface GetLockResponse extends BaseResponse {
  totalLocks: number;
  lockDetails: LockDetail[];
  channelName: string;
  channelType: RTM_CHANNEL_TYPE;
}

export type LockOperationResponse = BaseResponse & {
  channelName: string;
  channelType: RTM_CHANNEL_TYPE;
  lockName: string;
};
export type SetLockResponse = LockOperationResponse;

export type RemoveLockResponse = LockOperationResponse;

export type RevokeLockResponse = LockOperationResponse;

export type ReleaseLockResponse = LockOperationResponse;

export type AcquireLockResponse = LockOperationResponse;

export interface SetLockOptions {
  ttl?: number;
}

export interface AcquireLockOptions {
  retry?: boolean;
}

export abstract class RTMLock {
  abstract setLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string,
    options?: SetLockOptions
  ): Promise<SetLockResponse>;

  abstract removeLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string
  ): Promise<RemoveLockResponse>;

  abstract acquireLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string,
    options?: AcquireLockOptions // 默认false
  ): Promise<AcquireLockResponse>;

  abstract releaseLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string
  ): Promise<ReleaseLockResponse>;

  abstract revokeLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string,
    owner: string
  ): Promise<RevokeLockResponse>;

  abstract getLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE
  ): Promise<GetLockResponse>;
}
