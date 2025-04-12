import { callIrisApi } from '../../internal/IrisRtmEngine';
import { RTM_CHANNEL_TYPE } from '../AgoraRtmBase';
import { IRtmLock } from '../IAgoraRtmLock';

// @ts-ignore
export class IRtmLockImpl implements IRtmLock {
  setLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string,
    ttl: number
  ): any {
    const apiType = this.getApiTypeFromSetLock(
      channelName,
      channelType,
      lockName,
      ttl
    );
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      lockName: lockName,
      ttl: ttl,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
          lockName: lockName,
          ttl: ttl,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromSetLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string,
    ttl: number
  ): string {
    return 'RtmLock_setLock_89e5672';
  }

  getLocks(channelName: string, channelType: RTM_CHANNEL_TYPE): any {
    const apiType = this.getApiTypeFromGetLocks(channelName, channelType);
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromGetLocks(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE
  ): string {
    return 'RtmLock_getLocks_ad8568b';
  }

  removeLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string
  ): any {
    const apiType = this.getApiTypeFromRemoveLock(
      channelName,
      channelType,
      lockName
    );
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      lockName: lockName,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
          lockName: lockName,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromRemoveLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string
  ): string {
    return 'RtmLock_removeLock_4ffa44d';
  }

  acquireLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string,
    retry: boolean
  ): any {
    const apiType = this.getApiTypeFromAcquireLock(
      channelName,
      channelType,
      lockName,
      retry
    );
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      lockName: lockName,
      retry: retry,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
          lockName: lockName,
          retry: retry,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromAcquireLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string,
    retry: boolean
  ): string {
    return 'RtmLock_acquireLock_cd2dbc2';
  }

  releaseLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string
  ): any {
    const apiType = this.getApiTypeFromReleaseLock(
      channelName,
      channelType,
      lockName
    );
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      lockName: lockName,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
          lockName: lockName,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromReleaseLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string
  ): string {
    return 'RtmLock_releaseLock_4ffa44d';
  }

  revokeLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string,
    owner: string
  ): any {
    const apiType = this.getApiTypeFromRevokeLock(
      channelName,
      channelType,
      lockName,
      owner
    );
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      lockName: lockName,
      owner: owner,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
          lockName: lockName,
          owner: owner,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromRevokeLock(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    lockName: string,
    owner: string
  ): string {
    return 'RtmLock_revokeLock_fc4a9d7';
  }
}
