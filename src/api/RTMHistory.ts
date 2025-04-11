import { BaseResponse, ChannelType } from './common';
/**
 *  The option to get history message.
 */
export interface GetHistoryMessageOptions {
  /**
   * The maximum count of messages to get.
   */
  messageCount?: number;
  /**
   * The start timestamp of this query range.
   */
  start?: number;
  /**
   * The end timestamp of the query range.
   */
  end?: number;
}
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
/**@zh-cn
 * 历史消息频道类型。
 * - `MESSAGE`: MESSAGE CHANNEL 频道；
 * - `USEr`: 私密频道。
 */
/**
 * History Channel type.
 * - `MESSAGE`: MESSAGE CHANNEL;
 * - `USEr`: PRIVATE CHANNEL.
 */
export type HistoryChannelType = Exclude<ChannelType, 'STREAM'>;
export interface GetMessagesResponse extends BaseResponse {
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
}
export declare class RTMHistory {
  /**
   * Get history message of the channel.
   *
   * @param channelName A channel that needs to be specified.
   * @param HistoryChannelType channelType for this channel. See {@link HistoryChannelType}
   * @param options Options for this metadata operation. See {@link GetHistoryMessageOptions}.
   */
  getMessages(
    channelName: string,
    channelType: HistoryChannelType,
    options?: GetHistoryMessageOptions
  ): Promise<GetMessagesResponse>;
}
