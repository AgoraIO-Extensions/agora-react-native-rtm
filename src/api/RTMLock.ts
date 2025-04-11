import { BaseResponse, ChannelType } from './common';

export interface LockDetail {
  /**@zh-cn
   * 分布式锁名称。
   */
  /**
   * Distributed lock name.
   */
  lockName: string;

  /**@zh-cn
   * 分布式锁的占有者。
   */
  /**
   * The owner of the distributed lock.
   */
  owner: string;

  /**@zh-cn
   * 锁的过期时间。
   */
  /**
   * The expiration time of the lock.
   */
  ttl: number;
}

export interface GetLockResponse extends BaseResponse {
  /**@zh-cn
   * 此频道包含的锁数量。
   */
  /**
   * The number of locks contained in the channel.
   */
  totalLocks: number;

  /**@zh-cn
   * 每把锁的信息。
   */
  /**
   * The infos of every lock. See {@link LockDetail}
   */
  lockDetails: LockDetail[];

  /**@zh-cn
   * 锁所在频道名称。
   */
  /**
   * The channel name where the lock is located.
   */
  channelName: string;

  /**@zh-cn
   * 锁所在频道类型。
   */
  /**
   * The channel type where the lock is located.
   */
  channelType: ChannelType;
}

export interface LockOperationResponse extends BaseResponse {
  channelName: string;
  channelType: ChannelType;
  lockName: string;
}
export interface SetLockResponse extends LockOperationResponse {}

export interface RemoveLockResponse extends LockOperationResponse {}

export interface RevokeLockResponse extends LockOperationResponse {}

export interface ReleaseLockResponse extends LockOperationResponse {}

export interface AcquireLockResponse extends LockOperationResponse {}

export interface SetLockOptions {
  ttl?: number;
}

export interface AcquireLockOptions {
  retry?: boolean;
}

export abstract class RTMLock {
  abstract setLock(
    channelName: string,
    channelType: ChannelType,
    lockName: string,
    options?: SetLockOptions
  ): Promise<SetLockResponse>;

  abstract removeLock(
    channelName: string,
    channelType: ChannelType,
    lockName: string
  ): Promise<RemoveLockResponse>;

  abstract acquireLock(
    channelName: string,
    channelType: ChannelType,
    lockName: string,
    options?: AcquireLockOptions // 默认false
  ): Promise<AcquireLockResponse>;

  abstract releaseLock(
    channelName: string,
    channelType: ChannelType,
    lockName: string
  ): Promise<ReleaseLockResponse>;

  abstract revokeLock(
    channelName: string,
    channelType: ChannelType,
    lockName: string,
    owner: string
  ): Promise<RevokeLockResponse>;

  abstract getLock(
    channelName: string,
    channelType: ChannelType
  ): Promise<GetLockResponse>;
}
