import { RTM_CHANNEL_TYPE } from '../legacy/AgoraRtmBase';
import { GetHistoryMessagesOptions } from '../legacy/AgoraRtmBase';

import { BaseResponse } from './common';

/**
 *  The option to get history message.
 */
export interface HistoryMessage {
  /**
   * The payload
   */
  message: string | Uint8Array;
  /**
   * Message type
   */
  messageType: 'STRING' | 'BINARY';
  /**
   * The custom type of the message
   */
  customType: string;
  /**
   * The publisher
   */
  publisher: string;
  /**
   * Timestamp of the message received by rtm server
   */
  timestamp: number;
}
export type GetMessagesResponse = BaseResponse & {
  /**
   *  The history message list.
   */
  messageList: HistoryMessage[];
  /**
   * The message count.
   */
  count: number;
  /**
   * The timestamp of next history message. If newStart is 0, means there are no more history messages
   */
  newStart: number;
};
export abstract class RTMHistory {
  abstract getMessages(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    options?: GetHistoryMessagesOptions
  ): Promise<GetMessagesResponse>;
}
