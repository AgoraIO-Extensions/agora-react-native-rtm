import { HistoryMessage, RtmChannelType } from '../legacy/AgoraRtmBase';
import { GetHistoryMessagesOptions } from '../legacy/AgoraRtmBase';

import { BaseResponse } from './RTMClient';

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
    channelType: RtmChannelType,
    options?: GetHistoryMessagesOptions
  ): Promise<GetMessagesResponse>;
}
