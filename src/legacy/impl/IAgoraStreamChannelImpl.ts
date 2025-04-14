import { callIrisApi } from '../../internal/IrisRtmEngine';
import {
  IStreamChannel,
  JoinChannelOptions,
  JoinTopicOptions,
  TopicOptions,
} from '../IAgoraStreamChannel';

// @ts-ignore
export class IStreamChannelImpl implements IStreamChannel {
  join(options: JoinChannelOptions): any {
    const apiType = this.getApiTypeFromJoin(options);
    const jsonParams = {
      options: options,
      toJSON: () => {
        return {
          options: options,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromJoin(options: JoinChannelOptions): string {
    return 'StreamChannel_join_2090a6b';
  }

  renewToken(token: string): any {
    const apiType = this.getApiTypeFromRenewToken(token);
    const jsonParams = {
      token: token,
      toJSON: () => {
        return {
          token: token,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromRenewToken(token: string): string {
    return 'StreamChannel_renewToken_1fa04dd';
  }

  leave(): any {
    const apiType = this.getApiTypeFromLeave();
    const jsonParams = {};
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromLeave(): string {
    return 'StreamChannel_leave_90386a9';
  }

  getChannelName(): any {
    const apiType = this.getApiTypeFromGetChannelName();
    const jsonParams = {};
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromGetChannelName(): string {
    return 'StreamChannel_getChannelName';
  }

  joinTopic(topic: string, options: JoinTopicOptions): any {
    const apiType = this.getApiTypeFromJoinTopic(topic, options);
    const jsonParams = {
      topic: topic,
      options: options,
      toJSON: () => {
        return {
          topic: topic,
          options: options,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromJoinTopic(
    topic: string,
    options: JoinTopicOptions
  ): string {
    return 'StreamChannel_joinTopic_ff0ec3f';
  }

  leaveTopic(topic: string): any {
    const apiType = this.getApiTypeFromLeaveTopic(topic);
    const jsonParams = {
      topic: topic,
      toJSON: () => {
        return {
          topic: topic,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromLeaveTopic(topic: string): string {
    return 'StreamChannel_leaveTopic_1fa04dd';
  }

  subscribeTopic(topic: string, options: TopicOptions): any {
    const apiType = this.getApiTypeFromSubscribeTopic(topic, options);
    const jsonParams = {
      topic: topic,
      options: options,
      toJSON: () => {
        return {
          topic: topic,
          options: options,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromSubscribeTopic(
    topic: string,
    options: TopicOptions
  ): string {
    return 'StreamChannel_subscribeTopic_b801234';
  }

  unsubscribeTopic(topic: string, options: TopicOptions): any {
    const apiType = this.getApiTypeFromUnsubscribeTopic(topic, options);
    const jsonParams = {
      topic: topic,
      options: options,
      toJSON: () => {
        return {
          topic: topic,
          options: options,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromUnsubscribeTopic(
    topic: string,
    options: TopicOptions
  ): string {
    return 'StreamChannel_unsubscribeTopic_b801234';
  }

  getSubscribedUserList(topic: string, requestId: number): any {
    const apiType = this.getApiTypeFromGetSubscribedUserList(topic, requestId);
    const jsonParams = {
      topic: topic,
      requestId: requestId,
      toJSON: () => {
        return {
          topic: topic,
          requestId: requestId,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromGetSubscribedUserList(
    topic: string,
    requestId: number
  ): string {
    return 'StreamChannel_getSubscribedUserList_1fa04dd';
  }

  release(): any {
    const apiType = this.getApiTypeFromRelease();
    const jsonParams = {};
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromRelease(): string {
    return 'StreamChannel_release';
  }
}
