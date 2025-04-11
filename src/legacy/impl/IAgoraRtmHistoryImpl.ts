import { callIrisApi } from '../../internal/IrisRtmEngine';
import { GetHistoryMessagesOptions, RTM_CHANNEL_TYPE } from '../AgoraRtmBase';
import { IRtmHistory } from '../IAgoraRtmHistory';

// @ts-ignore
export class IRtmHistoryImpl implements IRtmHistory {
  getMessages(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    options: GetHistoryMessagesOptions
  ): number {
    const apiType = this.getApiTypeFromGetMessages(
      channelName,
      channelType,
      options
    );
    const jsonParams = {
      channelName: channelName,
      channelType: channelType,
      options: options,
      toJSON: () => {
        return {
          channelName: channelName,
          channelType: channelType,
          options: options,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    const requestId = jsonResults.requestId;
    return requestId;
  }

  protected getApiTypeFromGetMessages(
    channelName: string,
    channelType: RTM_CHANNEL_TYPE,
    options: GetHistoryMessagesOptions
  ): string {
    return 'RtmHistory_getMessages_e5877fc';
  }
}
