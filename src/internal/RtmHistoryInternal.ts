import { GetMessagesResponse, RTMHistory } from '../api/RTMHistory';
import {
  GetHistoryMessagesOptions,
  RTM_CHANNEL_TYPE,
} from '../legacy/AgoraRtmBase';
import { IRtmHistoryImpl } from '../legacy/impl/IAgoraRtmHistoryImpl';

import { handleError, wrapRtmResult } from './IrisRtmEngine';
export class RtmHistoryInternal extends RTMHistory {
  private _rtmHistoryImpl: IRtmHistoryImpl = new IRtmHistoryImpl();

  async getMessages(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    options?: GetHistoryMessagesOptions
  ): Promise<GetMessagesResponse> {
    let operation = 'getMessages';
    let callBack = 'onGetHistoryMessagesResult';
    try {
      const status = this._rtmHistoryImpl.getMessages(
        channelName,
        channelType,
        options ?? new GetHistoryMessagesOptions()
      );
      let result = await wrapRtmResult(status, operation, callBack, true);
      return {
        timestamp: result.timestamp,
        messageList: result.callBackResult?.messageList,
        count: result.callBackResult?.count,
        newStart: result.callBackResult?.newStart,
      };
    } catch (error) {
      throw handleError(error, operation);
    }
  }
}
