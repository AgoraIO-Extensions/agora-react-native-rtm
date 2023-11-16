import {
  IChannel,
  IChannelAttributes,
  IChannelEventHandler,
  IChannelMember,
  IMessage,
  IRtmService,
  IRtmServiceEventHandler,
} from '../IAgoraRtmService';
import { callIrisApi } from '../index';

/// Generated by terra, DO NOT MODIFY BY HAND.

// @ts-ignore
export class IMessageImpl implements IMessage {
  getMessageId(): number {
    const apiType = this.getApiTypeFromGetMessageId();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromGetMessageId(): string {
    return 'Message_getMessageId';
  }

  getMessageType(): number {
    const apiType = this.getApiTypeFromGetMessageType();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromGetMessageType(): string {
    return 'Message_getMessageType';
  }

  setText(str: string): void {
    const apiType = this.getApiTypeFromSetText();
    const jsonParams = {
      str: str,
      toJSON: () => {
        return {
          str: str,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromSetText(): string {
    return 'Message_setText';
  }

  getText(): string {
    const apiType = this.getApiTypeFromGetText();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromGetText(): string {
    return 'Message_getText';
  }

  getRawMessageData(): Uint8Array {
    const apiType = this.getApiTypeFromGetRawMessageData();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromGetRawMessageData(): string {
    return 'Message_getRawMessageData';
  }

  getRawMessageLength(): number {
    const apiType = this.getApiTypeFromGetRawMessageLength();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromGetRawMessageLength(): string {
    return 'Message_getRawMessageLength';
  }

  setMessageType(type: number): void {
    const apiType = this.getApiTypeFromSetMessageType();
    const jsonParams = {
      type: type,
      toJSON: () => {
        return {
          type: type,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromSetMessageType(): string {
    return 'Message_setMessageType';
  }

  setRawMessage(data: Uint8Array, length: number): void {
    const apiType = this.getApiTypeFromSetRawMessage();
    const jsonParams = {
      data: data,
      length: length,
      toJSON: () => {
        return {
          data: data,
          length: length,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromSetRawMessage(): string {
    return 'Message_setRawMessage';
  }

  release(): void {
    const apiType = this.getApiTypeFromRelease();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromRelease(): string {
    return 'Message_release';
  }
}

// @ts-ignore
export class IChannelMemberImpl implements IChannelMember {
  getMemberId(): string {
    const apiType = this.getApiTypeFromGetMemberId();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromGetMemberId(): string {
    return 'ChannelMember_getMemberId';
  }

  getChannelId(): string {
    const apiType = this.getApiTypeFromGetChannelId();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromGetChannelId(): string {
    return 'ChannelMember_getChannelId';
  }

  release(): void {
    const apiType = this.getApiTypeFromRelease();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromRelease(): string {
    return 'ChannelMember_release';
  }
}

// @ts-ignore
export class IChannelAttributesImpl implements IChannelAttributes {
  addAttribute(key: string, value: string): number {
    const apiType = this.getApiTypeFromAddAttribute();
    const jsonParams = {
      key: key,
      value: value,
      toJSON: () => {
        return {
          key: key,
          value: value,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromAddAttribute(): string {
    return 'ChannelAttributes_addAttribute';
  }

  removeAttribute(key: string): number {
    const apiType = this.getApiTypeFromRemoveAttribute();
    const jsonParams = {
      key: key,
      toJSON: () => {
        return {
          key: key,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromRemoveAttribute(): string {
    return 'ChannelAttributes_removeAttribute';
  }

  getAttributesSize(): number {
    const apiType = this.getApiTypeFromGetAttributesSize();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromGetAttributesSize(): string {
    return 'ChannelAttributes_getAttributesSize';
  }

  getAttributes(size: number, key: string[], value: string[]): void {
    const apiType = this.getApiTypeFromGetAttributes();
    const jsonParams = {
      size: size,
      key: key,
      value: value,
      toJSON: () => {
        return {
          size: size,
          key: key,
          value: value,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromGetAttributes(): string {
    return 'ChannelAttributes_getAttributes';
  }

  getAttributeValue(key: string): string {
    const apiType = this.getApiTypeFromGetAttributeValue();
    const jsonParams = {
      key: key,
      toJSON: () => {
        return {
          key: key,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromGetAttributeValue(): string {
    return 'ChannelAttributes_getAttributeValue';
  }

  release(): number {
    const apiType = this.getApiTypeFromRelease();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromRelease(): string {
    return 'ChannelAttributes_release';
  }
}

export function processIChannelEventHandler(
  handler: IChannelEventHandler,
  event: string,
  jsonParams: any
) {
  switch (event) {
    case 'onJoinSuccess':
      if (handler.onJoinSuccess !== undefined) {
        handler.onJoinSuccess();
      }
      break;
    case 'onJoinFailure':
      if (handler.onJoinFailure !== undefined) {
        handler.onJoinFailure(jsonParams.errorCode);
      }
      break;
    case 'onLeave':
      if (handler.onLeave !== undefined) {
        handler.onLeave(jsonParams.errorCode);
      }
      break;
    case 'onMessageReceived':
      if (handler.onMessageReceived !== undefined) {
        handler.onMessageReceived(jsonParams.userId, jsonParams.message);
      }
      break;
    case 'onSendMessageState':
      if (handler.onSendMessageState !== undefined) {
        handler.onSendMessageState(jsonParams.messageId, jsonParams.state);
      }
      break;
    case 'onSendMessageResult':
      if (handler.onSendMessageResult !== undefined) {
        handler.onSendMessageResult(jsonParams.messageId, jsonParams.state);
      }
      break;
    case 'onMemberJoined':
      if (handler.onMemberJoined !== undefined) {
        handler.onMemberJoined(jsonParams.member);
      }
      break;
    case 'onMemberLeft':
      if (handler.onMemberLeft !== undefined) {
        handler.onMemberLeft(jsonParams.member);
      }
      break;
    case 'onMembersGotten':
      if (handler.onMembersGotten !== undefined) {
        handler.onMembersGotten(jsonParams.members, jsonParams.userCount);
      }
      break;
    case 'onAttributesUpdated':
      if (handler.onAttributesUpdated !== undefined) {
        handler.onAttributesUpdated(jsonParams.attributes);
      }
      break;
    case 'onUpdateAttributesResponse':
      if (handler.onUpdateAttributesResponse !== undefined) {
        handler.onUpdateAttributesResponse(
          jsonParams.requestId,
          jsonParams.resCode
        );
      }
      break;
    case 'onAttributesDeleted':
      if (handler.onAttributesDeleted !== undefined) {
        handler.onAttributesDeleted(jsonParams.attributes);
      }
      break;
    case 'onDeleteAttributesResponse':
      if (handler.onDeleteAttributesResponse !== undefined) {
        handler.onDeleteAttributesResponse(
          jsonParams.requestId,
          jsonParams.resCode
        );
      }
      break;
  }
}

// @ts-ignore
export class IChannelImpl implements IChannel {
  setEventHandler(eventHandler: IChannelEventHandler): void {
    const apiType = this.getApiTypeFromSetEventHandler();
    const jsonParams = {
      eventHandler: eventHandler,
      toJSON: () => {
        return {
          eventHandler: eventHandler,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromSetEventHandler(): string {
    return 'Channel_setEventHandler';
  }

  join(): number {
    const apiType = this.getApiTypeFromJoin();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromJoin(): string {
    return 'Channel_join';
  }

  leave(): number {
    const apiType = this.getApiTypeFromLeave();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromLeave(): string {
    return 'Channel_leave';
  }

  sendMessage(message: IMessage[]): number {
    const apiType = this.getApiTypeFromSendMessage();
    const jsonParams = {
      message: message,
      toJSON: () => {
        return {
          message: message,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromSendMessage(): string {
    return 'Channel_sendMessage';
  }

  updateAttributes(
    attributes: IChannelAttributes[],
    requestId: number
  ): number {
    const apiType = this.getApiTypeFromUpdateAttributes();
    const jsonParams = {
      attributes: attributes,
      requestId: requestId,
      toJSON: () => {
        return {
          attributes: attributes,
          requestId: requestId,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromUpdateAttributes(): string {
    return 'Channel_updateAttributes';
  }

  deleteAttributes(
    attributes: IChannelAttributes[],
    requestId: number
  ): number {
    const apiType = this.getApiTypeFromDeleteAttributes();
    const jsonParams = {
      attributes: attributes,
      requestId: requestId,
      toJSON: () => {
        return {
          attributes: attributes,
          requestId: requestId,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromDeleteAttributes(): string {
    return 'Channel_deleteAttributes';
  }

  getId(): string {
    const apiType = this.getApiTypeFromGetId();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromGetId(): string {
    return 'Channel_getId';
  }

  release(): number {
    const apiType = this.getApiTypeFromRelease();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromRelease(): string {
    return 'Channel_release';
  }
}

export function processIRtmServiceEventHandler(
  handler: IRtmServiceEventHandler,
  event: string,
  jsonParams: any
) {
  switch (event) {
    case 'onLoginSuccess':
      if (handler.onLoginSuccess !== undefined) {
        handler.onLoginSuccess();
      }
      break;
    case 'onLoginFailure':
      if (handler.onLoginFailure !== undefined) {
        handler.onLoginFailure(jsonParams.errorCode);
      }
      break;
    case 'onLogout':
      if (handler.onLogout !== undefined) {
        handler.onLogout();
      }
      break;
    case 'onConnectionStateChanged':
      if (handler.onConnectionStateChanged !== undefined) {
        handler.onConnectionStateChanged(jsonParams.state);
      }
      break;
    case 'onSendMessageState':
      if (handler.onSendMessageState !== undefined) {
        handler.onSendMessageState(jsonParams.messageId, jsonParams.state);
      }
      break;
    case 'onMessageReceivedFromPeer':
      if (handler.onMessageReceivedFromPeer !== undefined) {
        handler.onMessageReceivedFromPeer(
          jsonParams.peerId,
          jsonParams.message
        );
      }
      break;
  }
}

// @ts-ignore
export class IRtmServiceImpl implements IRtmService {
  initialize(appId: string, eventHandler: IRtmServiceEventHandler): number {
    const apiType = this.getApiTypeFromInitialize();
    const jsonParams = {
      appId: appId,
      eventHandler: eventHandler,
      toJSON: () => {
        return {
          appId: appId,
          eventHandler: eventHandler,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromInitialize(): string {
    return 'RtmService_initialize';
  }

  unregisterObserver(eventHandler: IRtmServiceEventHandler): void {
    const apiType = this.getApiTypeFromUnregisterObserver();
    const jsonParams = {
      eventHandler: eventHandler,
      toJSON: () => {
        return {
          eventHandler: eventHandler,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromUnregisterObserver(): string {
    return 'RtmService_unregisterObserver';
  }

  release(sync: boolean): number {
    const apiType = this.getApiTypeFromRelease();
    const jsonParams = {
      sync: sync,
      toJSON: () => {
        return {
          sync: sync,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromRelease(): string {
    return 'RtmService_release';
  }

  login(token: string, userId: string): number {
    const apiType = this.getApiTypeFromLogin();
    const jsonParams = {
      token: token,
      userId: userId,
      toJSON: () => {
        return {
          token: token,
          userId: userId,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromLogin(): string {
    return 'RtmService_login';
  }

  logout(): number {
    const apiType = this.getApiTypeFromLogout();
    const jsonParams = {};
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromLogout(): string {
    return 'RtmService_logout';
  }

  sendMessageToPeer(peerId: string, message: IMessage[]): number {
    const apiType = this.getApiTypeFromSendMessageToPeer();
    const jsonParams = {
      peerId: peerId,
      message: message,
      toJSON: () => {
        return {
          peerId: peerId,
          message: message,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromSendMessageToPeer(): string {
    return 'RtmService_sendMessageToPeer';
  }

  createChannel(
    channelId: string,
    eventHandler: IChannelEventHandler
  ): IChannel[] {
    const apiType = this.getApiTypeFromCreateChannel();
    const jsonParams = {
      channelId: channelId,
      eventHandler: eventHandler,
      toJSON: () => {
        return {
          channelId: channelId,
          eventHandler: eventHandler,
        };
      },
    };
    const jsonResults = callIrisApi.call(this, apiType, jsonParams);
    return jsonResults.result;
  }

  protected getApiTypeFromCreateChannel(): string {
    return 'RtmService_createChannel';
  }
}
