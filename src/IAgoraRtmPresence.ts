import {
  GetOnlineUsersOptions,
  PresenceOptions,
  RTM_CHANNEL_TYPE,
  StateItem,
} from './AgoraRtmBase';

/// Generated by terra, DO NOT MODIFY BY HAND.

/**
 * The IRtmPresence class.
 *
 * This class provides the rtm presence methods that can be invoked by your app.
 */
export abstract class IRtmPresence {
  abstract whoNow(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    options: PresenceOptions,
    requestId: number
  ): number;
  abstract whereNow(userId: string, requestId: number): number;
  abstract setState(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    items: StateItem[],
    count: number,
    requestId: number
  ): number;
  abstract removeState(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    keys: string[],
    count: number,
    requestId: number
  ): number;
  abstract getState(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    userId: string,
    requestId: number
  ): number;
  abstract getOnlineUsers(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    options: GetOnlineUsersOptions,
    requestId: number
  ): number;
  abstract getUserChannels(userId: string, requestId: number): number;
}
