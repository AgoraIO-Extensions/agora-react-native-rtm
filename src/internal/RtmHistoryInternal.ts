import {
  GetHistoryMessageOptions,
  GetMessagesResponse,
  HistoryChannelType,
  RTMHistory,
} from '../api/RTMHistory';

export class RtmHistoryInternal extends RTMHistory {
  getMessages(
    channelName: string,
    channelType: HistoryChannelType,
    options?: GetHistoryMessageOptions
  ): Promise<GetMessagesResponse> {
    throw new Error('Method not implemented.');
  }
  constructor() {
    super();
  }
}
