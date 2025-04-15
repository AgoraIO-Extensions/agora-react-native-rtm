import { ChannelType } from '../api';
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

import { handleError } from './IrisRtmEngine';
import { wrapRtmResult } from './IrisRtmEngine';

export class RtmLockInternal extends RTMLock {
  setLock(
    channelName: string,
    channelType: ChannelType,
    lockName: string,
    options?: SetLockOptions
  ): Promise<SetLockResponse> {
    throw new Error('Method not implemented.');
    // let operation = 'setLock';
    // let callBack = 'onSetLockResult';
    // try {
    //   const status = super.setLock(
    //     channelName,
    //     channelType,
    //     lockName,
    //     options!
    //   );
    //   return wrapRtmResult(status, operation, callBack);
    // } catch (error) {
    //   throw handleError(error, operation);
    // }
  }
  removeLock(
    channelName: string,
    channelType: ChannelType,
    lockName: string
  ): Promise<RemoveLockResponse> {
    throw new Error('Method not implemented.');
  }
  acquireLock(
    channelName: string,
    channelType: ChannelType,
    lockName: string,
    options?: AcquireLockOptions
  ): Promise<AcquireLockResponse> {
    throw new Error('Method not implemented.');
  }
  releaseLock(
    channelName: string,
    channelType: ChannelType,
    lockName: string
  ): Promise<ReleaseLockResponse> {
    throw new Error('Method not implemented.');
  }
  revokeLock(
    channelName: string,
    channelType: ChannelType,
    lockName: string,
    owner: string
  ): Promise<RevokeLockResponse> {
    throw new Error('Method not implemented.');
  }
  getLock(
    channelName: string,
    channelType: ChannelType
  ): Promise<GetLockResponse> {
    throw new Error('Method not implemented.');
  }
  constructor() {
    super();
  }
}
