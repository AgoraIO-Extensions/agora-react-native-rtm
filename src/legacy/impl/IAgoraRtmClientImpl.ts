import { callIrisApi } from '../../internal/IrisRtmEngine';
import { PublishOptions, SubscribeOptions } from '../AgoraRtmBase';
import { IRtmClient } from '../IAgoraRtmClient';

// @ts-ignore
export class IRtmClientImpl implements IRtmClient {
  release(): any {
    const apiType = this.getApiTypeFromRelease();
    const jsonParams = {};
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromRelease(): string {
    return 'RtmClient_release';
  }

  login(token: string): any {
    const apiType = this.getApiTypeFromLogin(token);
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

  protected getApiTypeFromLogin(token: string): string {
    return 'RtmClient_login_1fa04dd';
  }

  logout(): any {
    const apiType = this.getApiTypeFromLogout();
    const jsonParams = {};
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromLogout(): string {
    return 'RtmClient_logout_90386a9';
  }

  getStorage(): any {
    const apiType = this.getApiTypeFromGetStorage();
    const jsonParams = {};
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromGetStorage(): string {
    return 'RtmClient_getStorage';
  }

  getLock(): any {
    const apiType = this.getApiTypeFromGetLock();
    const jsonParams = {};
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromGetLock(): string {
    return 'RtmClient_getLock';
  }

  getPresence(): any {
    const apiType = this.getApiTypeFromGetPresence();
    const jsonParams = {};
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromGetPresence(): string {
    return 'RtmClient_getPresence';
  }

  getHistory(): any {
    const apiType = this.getApiTypeFromGetHistory();
    const jsonParams = {};
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromGetHistory(): string {
    return 'RtmClient_getHistory';
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
    return 'RtmClient_renewToken_1fa04dd';
  }

  publish(
    channelName: string,
    message: any,
    length: number,
    option: PublishOptions
  ): any {
    const apiType = this.getApiTypeFromPublish(
      channelName,
      message,
      length,
      option
    );
    const jsonParams = {
      channelName: channelName,
      message: message,
      length: length,
      option: option,
      toJSON: () => {
        return {
          channelName: channelName,
          message: message,
          length: length,
          option: option,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromPublish(
    channelName: string,
    message: any,
    length: number,
    option: PublishOptions
  ): string {
    return 'RtmClient_publish_2d36e93';
  }

  subscribe(channelName: string, options: SubscribeOptions): any {
    const apiType = this.getApiTypeFromSubscribe(channelName, options);
    const jsonParams = {
      channelName: channelName,
      options: options,
      toJSON: () => {
        return {
          channelName: channelName,
          options: options,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromSubscribe(
    channelName: string,
    options: SubscribeOptions
  ): string {
    return 'RtmClient_subscribe_3fae92d';
  }

  unsubscribe(channelName: string): any {
    const apiType = this.getApiTypeFromUnsubscribe(channelName);
    const jsonParams = {
      channelName: channelName,
      toJSON: () => {
        return {
          channelName: channelName,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromUnsubscribe(channelName: string): string {
    return 'RtmClient_unsubscribe_1fa04dd';
  }

  createStreamChannel(channelName: string): any {
    const apiType = this.getApiTypeFromCreateStreamChannel(channelName);
    const jsonParams = {
      channelName: channelName,
      toJSON: () => {
        return {
          channelName: channelName,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromCreateStreamChannel(channelName: string): string {
    return 'RtmClient_createStreamChannel_ae3d0cf';
  }

  setParameters(parameters: string): any {
    const apiType = this.getApiTypeFromSetParameters(parameters);
    const jsonParams = {
      parameters: parameters,
      toJSON: () => {
        return {
          parameters: parameters,
        };
      },
    };
    return callIrisApi.call(this, apiType, jsonParams);
  }

  protected getApiTypeFromSetParameters(parameters: string): string {
    return 'RtmClient_setParameters_3a2037f';
  }
}
