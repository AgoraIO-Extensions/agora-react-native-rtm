import {
  GetOnlineUsersResponse,
  GetStateResponse,
  GetUserChannelsResponse,
  RTMPresence,
  RemoveStateOptions,
  RemoveStateResponse,
  SetStateResponse,
  WhereNowResponse,
  WhoNowResponse,
} from '../api/RTMPresence';
import {
  PresenceOptions,
  RTM_CHANNEL_TYPE,
  StateItem,
} from '../legacy/AgoraRtmBase';
import { IRtmPresenceImpl } from '../legacy/impl/IAgoraRtmPresenceImpl';

import { handleError, wrapRtmResult } from './IrisRtmEngine';

export class RtmPresenceInternal extends RTMPresence {
  private _rtmPresenceImpl: IRtmPresenceImpl = new IRtmPresenceImpl();

  async whoNow(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    options?: PresenceOptions
  ): Promise<WhoNowResponse> {
    let operation = 'whoNow';
    let callBack = 'onWhoNowResult';
    try {
      const status = this._rtmPresenceImpl.whoNow(
        channelName,
        channelType,
        options ? options : new PresenceOptions()
      );
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        totalOccupancy: result.callBackResult?.count,
        occupants: result.callBackResult?.userStateList,
        nextPage: result.callBackResult?.nextPage,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async getOnlineUsers(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    options?: PresenceOptions
  ): Promise<GetOnlineUsersResponse> {
    let operation = 'getOnlineUsers';
    let callBack = 'onGetOnlineUsersResult';
    try {
      const status = this._rtmPresenceImpl.getOnlineUsers(
        channelName,
        channelType,
        options ? options : new PresenceOptions()
      );
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        totalOccupancy: result.callBackResult?.count,
        occupants: result.callBackResult?.userStateList,
        nextPage: result.callBackResult?.nextPage,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async whereNow(userId: string): Promise<WhereNowResponse> {
    let operation = 'whereNow';
    let callBack = 'onWhereNowResult';
    try {
      const status = this._rtmPresenceImpl.whereNow(userId);
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        channels: result.callBackResult?.channels,
        totalChannel: result.callBackResult?.count,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async getUserChannels(userId: string): Promise<GetUserChannelsResponse> {
    let operation = 'getUserChannels';
    let callBack = 'onGetUserChannelsResult';
    try {
      const status = this._rtmPresenceImpl.getUserChannels(userId);
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        channels: result.callBackResult?.channels,
        totalChannel: result.callBackResult?.count,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async setState(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    state: StateItem
  ): Promise<SetStateResponse> {
    let operation = 'setState';
    let callBack = 'onPresenceSetStateResult';
    try {
      const status = this._rtmPresenceImpl.setState(
        channelName,
        channelType,
        [state],
        1
      );
      let result = await wrapRtmResult(status, operation, callBack, true);
      return result;
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async getState(
    userId: string,
    channelName: string,
    channelType: RTM_CHANNEL_TYPE
  ): Promise<GetStateResponse> {
    let operation = 'getState';
    let callBack = 'onPresenceGetStateResult';
    try {
      const status = this._rtmPresenceImpl.getState(
        channelName,
        channelType,
        userId
      );
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        statesCount: result.callBackResult?.state.statesCount,
        states: result.callBackResult?.state.states,
        userId: result.callBackResult?.state.userId,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
  async removeState(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    options?: RemoveStateOptions
  ): Promise<RemoveStateResponse> {
    let operation = 'removeState';
    let callBack = 'onPresenceRemoveStateResult';
    try {
      const status = this._rtmPresenceImpl.removeState(
        channelName,
        channelType,
        options?.states ?? [],
        options?.states?.length ?? 0
      );
      let result = await wrapRtmResult(status, operation, callBack, true);
      return result;
    } catch (error) {
      throw handleError(error, operation);
    }
  }
}
