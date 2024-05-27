import { PublishOptions, UserList } from '../AgoraRtmBase';
import {
  IStreamChannel,
  JoinChannelOptions,
  JoinTopicOptions,
  TopicOptions,
} from '../IAgoraStreamChannel';

// @ts-ignore
export class IStreamChannelImpl implements IStreamChannel {
  join(options: JoinChannelOptions): number {
    const apiType = this.getApiTypeFromJoin(options);
    const jsonParams = {
      options: options,
      toJSON: () => {
        return {
          options: options,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    const requestId = jsonResults.requestId;
    return requestId;
  }

  protected getApiTypeFromJoin(options: JoinChannelOptions): string {
    return 'StreamChannel_join';
  }

  renewToken(token: string): number {
    const apiType = this.getApiTypeFromRenewToken(token);
    const jsonParams = {
      token: token,
      toJSON: () => {
        return {
          token: token,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromRenewToken(token: string): string {
    return 'StreamChannel_renewToken';
  }

  leave(): number {
    const apiType = this.getApiTypeFromLeave();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    const requestId = jsonResults.requestId;
    return requestId;
  }

  protected getApiTypeFromLeave(): string {
    return 'StreamChannel_leave';
  }

  getChannelName(): string {
    const apiType = this.getApiTypeFromGetChannelName();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromGetChannelName(): string {
    return 'StreamChannel_getChannelName';
  }

  joinTopic(topic: string, options: JoinTopicOptions): number {
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
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    const requestId = jsonResults.requestId;
    return requestId;
  }

  protected getApiTypeFromJoinTopic(
    topic: string,
    options: JoinTopicOptions
  ): string {
    return 'StreamChannel_joinTopic';
  }

  publishTopicMessage(
    topic: string,
    message: string,
    length: number,
    option: PublishOptions
  ): number {
    const apiType = this.getApiTypeFromPublishTopicMessage(
      topic,
      message,
      length,
      option
    );
    const jsonParams = {
      topic: topic,
      message: message,
      length: length,
      option: option,
      toJSON: () => {
        return {
          topic: topic,
          message: message,
          length: length,
          option: option,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromPublishTopicMessage(
    topic: string,
    message: string,
    length: number,
    option: PublishOptions
  ): string {
    return 'StreamChannel_publishTopicMessage';
  }

  leaveTopic(topic: string): number {
    const apiType = this.getApiTypeFromLeaveTopic(topic);
    const jsonParams = {
      topic: topic,
      toJSON: () => {
        return {
          topic: topic,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    const requestId = jsonResults.requestId;
    return requestId;
  }

  protected getApiTypeFromLeaveTopic(topic: string): string {
    return 'StreamChannel_leaveTopic';
  }

  subscribeTopic(topic: string, options: TopicOptions): number {
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
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    const requestId = jsonResults.requestId;
    return requestId;
  }

  protected getApiTypeFromSubscribeTopic(
    topic: string,
    options: TopicOptions
  ): string {
    return 'StreamChannel_subscribeTopic';
  }

  unsubscribeTopic(topic: string, options: TopicOptions): number {
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
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromUnsubscribeTopic(
    topic: string,
    options: TopicOptions
  ): string {
    return 'StreamChannel_unsubscribeTopic';
  }

  getSubscribedUserList(topic: string): UserList[] {
    const apiType = this.getApiTypeFromGetSubscribedUserList(topic);
    const jsonParams = {
      topic: topic,
      toJSON: () => {
        return {
          topic: topic,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromGetSubscribedUserList(topic: string): string {
    return 'StreamChannel_getSubscribedUserList';
  }

  release(): number {
    const apiType = this.getApiTypeFromRelease();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromRelease(): string {
    return 'StreamChannel_release';
  }

  publishTopicMessageWithBuffer(
    topic: string,
    message: Uint8Array,
    length: number,
    option: PublishOptions
  ): number {
    const apiType = this.getApiTypeFromPublishTopicMessageWithBuffer(
      topic,
      message,
      length,
      option
    );
    const jsonParams = {
      topic: topic,
      message: message,
      length: length,
      option: option,
      toJSON: () => {
        return {
          topic: topic,
          length: length,
          option: option,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromPublishTopicMessageWithBuffer(
    topic: string,
    message: Uint8Array,
    length: number,
    option: PublishOptions
  ): string {
    return 'StreamChannel_publishTopicMessageWithBuffer';
  }
}

import { callIrisApi } from '../internal/IrisRtmEngine';
