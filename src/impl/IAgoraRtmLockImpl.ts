import { RTM_CHANNEL_TYPE } from '../AgoraRtmBase';
import { IRtmLock } from '../IAgoraRtmLock';
import { callIrisApi } from '../index';

/// Generated by terra, DO NOT MODIFY BY HAND.

// @ts-ignore
export class IRtmLockImpl implements IRtmLock {
  setLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string,
    ttl: number,
    requestId?: number
  ): number {
    const apiType = this.getApiTypeFromSetLock();
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      lockName: lockName,
      ttl: ttl,
      requestId: requestId,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
          lockName: lockName,
          ttl: ttl,
          requestId: requestId,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromSetLock(): string {
    return 'RtmLock_setLock';
  }

  getLocks(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    requestId?: number
  ): number {
    const apiType = this.getApiTypeFromGetLocks();
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      requestId: requestId,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
          requestId: requestId,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromGetLocks(): string {
    return 'RtmLock_getLocks';
  }

  removeLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string,
    requestId?: number
  ): number {
    const apiType = this.getApiTypeFromRemoveLock();
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      lockName: lockName,
      requestId: requestId,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
          lockName: lockName,
          requestId: requestId,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromRemoveLock(): string {
    return 'RtmLock_removeLock';
  }

  acquireLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string,
    retry: boolean,
    requestId?: number
  ): number {
    const apiType = this.getApiTypeFromAcquireLock();
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      lockName: lockName,
      retry: retry,
      requestId: requestId,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
          lockName: lockName,
          retry: retry,
          requestId: requestId,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromAcquireLock(): string {
    return 'RtmLock_acquireLock';
  }

  releaseLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string,
    requestId?: number
  ): number {
    const apiType = this.getApiTypeFromReleaseLock();
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      lockName: lockName,
      requestId: requestId,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
          lockName: lockName,
          requestId: requestId,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromReleaseLock(): string {
    return 'RtmLock_releaseLock';
  }

  revokeLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string,
    owner: string,
    requestId?: number
  ): number {
    const apiType = this.getApiTypeFromRevokeLock();
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      lockName: lockName,
      owner: owner,
      requestId: requestId,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
          lockName: lockName,
          owner: owner,
          requestId: requestId,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromRevokeLock(): string {
    return 'RtmLock_revokeLock';
  }
}
