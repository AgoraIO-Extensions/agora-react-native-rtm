import {
  AcquireLockOptions,
  AcquireLockResponse,
  GetLockResponse,
  RTMLock,
  ReleaseLockResponse,
  RemoveLockResponse,
  RevokeLockResponse,
  SetLockOptions,
  SetLockResponse,
} from '../api/RTMLock';
import { RtmChannelType } from '../legacy/AgoraRtmBase';
import { IRtmLockImpl } from '../legacy/impl/IAgoraRtmLockImpl';

import { handleError } from './IrisRtmEngine';
import { wrapRtmResult } from './IrisRtmEngine';

export class RtmLockInternal extends RTMLock {
  private _rtmLockImpl: IRtmLockImpl = new IRtmLockImpl();

  async setLock(
    channelName: string,
    channelType: RtmChannelType,
    lockName: string,
    options?: SetLockOptions
  ): Promise<SetLockResponse> {
    let operation = 'setLock';
    let callBack = 'onSetLockResult';
    try {
      const status = this._rtmLockImpl.setLock(
        channelName,
        channelType,
        lockName,
        options?.ttl ?? 0
      );
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        channelName: result.callBackResult?.channelName,
        channelType: result.callBackResult?.channelType,
        lockName: result.callBackResult?.lockName,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async removeLock(
    channelName: string,
    channelType: RtmChannelType,
    lockName: string
  ): Promise<RemoveLockResponse> {
    let operation = 'removeLock';
    let callBack = 'onRemoveLockResult';
    try {
      const status = this._rtmLockImpl.removeLock(
        channelName,
        channelType,
        lockName
      );
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        channelName: result.callBackResult?.channelName,
        channelType: result.callBackResult?.channelType,
        lockName: result.callBackResult?.lockName,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async acquireLock(
    channelName: string,
    channelType: RtmChannelType,
    lockName: string,
    options?: AcquireLockOptions
  ): Promise<AcquireLockResponse> {
    let operation = 'acquireLock';
    let callBack = 'onAcquireLockResult';
    try {
      const status = this._rtmLockImpl.acquireLock(
        channelName,
        channelType,
        lockName,
        options?.retry ?? false
      );
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        channelName: result.callBackResult?.channelName,
        channelType: result.callBackResult?.channelType,
        lockName: result.callBackResult?.lockName,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async releaseLock(
    channelName: string,
    channelType: RtmChannelType,
    lockName: string
  ): Promise<ReleaseLockResponse> {
    let operation = 'releaseLock';
    let callBack = 'onReleaseLockResult';
    try {
      const status = this._rtmLockImpl.releaseLock(
        channelName,
        channelType,
        lockName
      );
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        channelName: result.callBackResult?.channelName,
        channelType: result.callBackResult?.channelType,
        lockName: result.callBackResult?.lockName,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async revokeLock(
    channelName: string,
    channelType: RtmChannelType,
    lockName: string,
    owner: string
  ): Promise<RevokeLockResponse> {
    let operation = 'revokeLock';
    let callBack = 'onRevokeLockResult';
    try {
      const status = this._rtmLockImpl.revokeLock(
        channelName,
        channelType,
        lockName,
        owner
      );
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        channelName: result.callBackResult?.channelName,
        channelType: result.callBackResult?.channelType,
        lockName: result.callBackResult?.lockName,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async getLock(
    channelName: string,
    channelType: RtmChannelType
  ): Promise<GetLockResponse> {
    let operation = 'getLock';
    let callBack = 'onGetLocksResult';
    try {
      const status = this._rtmLockImpl.getLocks(channelName, channelType);
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        channelName: result.callBackResult?.channelName,
        channelType: result.callBackResult?.channelType,
        totalLocks: result.callBackResult?.count,
        lockDetails: result.callBackResult?.lockDetailList,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
}
