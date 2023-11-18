/// Generated by terra, DO NOT MODIFY BY HAND.

export enum PEER_MESSAGE_STATE {
  PEER_MESSAGE_INIT = 0,
  PEER_MESSAGE_FAILURE = 1,
  PEER_MESSAGE_PEER_UNREACHABLE = 2,
  PEER_MESSAGE_RECEIVED_BY_PEER = 3,
  PEER_MESSAGE_SENT_TIMEOUT = 4,
}

/**
 * The login error code.
 */
export enum LOGIN_ERR_CODE {
  LOGIN_ERR_OK = 0,
  LOGIN_ERR_UNKNOWN = 1,
  LOGIN_ERR_REJECTED = 2,
  LOGIN_ERR_INVALID_ARGUMENT = 3,
  LOGIN_ERR_INVALID_APP_ID = 4,
  LOGIN_ERR_INVALID_TOKEN = 5,
  LOGIN_ERR_TOKEN_EXPIRED = 6,
  LOGIN_ERR_NOT_AUTHORIZED = 7,
  LOGIN_ERR_TIMEOUT = 8,
}

/**
 * The logout error code.
 */
export enum LOGOUT_ERR_CODE {
  LOGOUT_ERR_OK = 0,
  LOGOUT_ERR_REJECTED = 1,
}

/**
 * The connection state.
 */
export enum CONNECTION_STATE {
  CONNECTION_STATE_CONNECTED = 1,
  CONNECTION_STATE_DISCONNECTED = 2,
  CONNECTION_STATE_ABORTED = 3,
}

/**
 * The state of the channel message.
 */
export enum CHANNEL_MESSAGE_STATE {
  CHANNEL_MESSAGE_RECEIVED_BY_SERVER = 1,
  CHANNEL_MESSAGE_SENT_TIMEOUT = 3,
}

/**
 * The join channel error.
 */
export enum JOIN_CHANNEL_ERR {
  JOIN_CHANNEL_ERR_OK = 0,
  JOIN_CHANNEL_ERR_FAILURE = 1,
  JOIN_CHANNEL_ERR_REJECTED = 2,
  JOIN_CHANNEL_ERR_INVALID_ARGUMENT = 3,
  JOIN_CHANNEL_TIMEOUT = 4,
  JOIN_CHANNEL_ERR_EXCEED_LIMIT = 5,
  JOIN_CHANNEL_ERR_ALREADY_JOINED = 6,
  JOIN_CHANNEL_ERR_TOO_OFTEN = 7,
  JOIN_CHANNEL_ERR_JOIN_SAME_CHANNEL_TOO_OFTEN = 8,
  JOIN_CHANNEL_ERR_NOT_INITIALIZED = 101,
  JOIN_CHANNEL_ERR_USER_NOT_LOGGED_IN = 102,
}

/**
 * @brief Error codes related to leaving a channel.
 */
export enum LEAVE_CHANNEL_ERR {
  LEAVE_CHANNEL_ERR_OK = 0,
  LEAVE_CHANNEL_ERR_FAILURE = 1,
  LEAVE_CHANNEL_ERR_REJECTED = 2,
  LEAVE_CHANNEL_ERR_NOT_IN_CHANNEL = 3,
  LEAVE_CHANNEL_ERR_NOT_INITIALIZED = 101,
  LEAVE_CHANNEL_ERR_USER_NOT_LOGGED_IN = 102,
}

/**
 * The reason for a user to leave the channel.
 */
export enum LEAVE_CHANNEL_REASON {
  LEAVE_CHANNEL_REASON_QUIT = 1,
  LEAVE_CHANNEL_REASON_KICKED = 2,
}

/**
 * @brief Error codes related to sending a channel message.
 */
export enum CHANNEL_MESSAGE_ERR_CODE {
  CHANNEL_MESSAGE_ERR_OK = 0,
  CHANNEL_MESSAGE_ERR_FAILURE = 1,
  CHANNEL_MESSAGE_ERR_SENT_TIMEOUT = 2,
  CHANNEL_MESSAGE_ERR_TOO_OFTEN = 3,
  CHANNEL_MESSAGE_ERR_INVALID_MESSAGE = 4,
  CHANNEL_MESSAGE_ERR_NOT_INITIALIZED = 101,
  CHANNEL_MESSAGE_ERR_USER_NOT_LOGGED_IN = 102,
}

/**
 * The response code.
 */
export enum RESPONSE_CODE {
  RESPONSE_CODE_SUCCESS = 1,
  RESPONSE_CODE_FAILURE = 2,
}

/**
 * The message type.
 */
export enum MESSAGE_TYPE {
  MESSAGE_TYPE_UNDEFINED = 0,
  MESSAGE_TYPE_TEXT = 1,
  MESSAGE_TYPE_BINARY = 2,
  MESSAGE_TYPE_CONVERGE = 4,
}

/**
 * The IMessage class.
 */
export abstract class IMessage {
  abstract getMessageId(): number;
  abstract getMessageType(): number;
  abstract setText(str: string): void;
  abstract getText(): string;
  abstract getRawMessageData(): Uint8Array;
  abstract getRawMessageLength(): number;
  abstract setMessageType(type: number): void;
  abstract setRawMessage(data: Uint8Array, length: number): void;
  abstract release(): void;
}

/**
 * The IChannelMember class.
 */
export abstract class IChannelMember {
  abstract getMemberId(): string;
  abstract getChannelId(): string;
  abstract release(): void;
}

/**
 * The IChannelAttributes class.
 */
export abstract class IChannelAttributes {
  abstract addAttribute(key: string, value: string): number;
  abstract removeAttribute(key: string): number;
  abstract getAttributesSize(): number;
  abstract getAttributes(size: number, key: string[], value: string[]): void;
  abstract getAttributeValue(key: string): string;
  abstract release(): number;
}

/**
 * The IChannelEventHandler class.
 */
export interface IChannelEventHandler {
  onJoinSuccess?(): void;
  onJoinFailure?(errorCode: JOIN_CHANNEL_ERR): void;
  onLeave?(errorCode: LEAVE_CHANNEL_ERR): void;
  onMessageReceived?(userId: string, message: IMessage[]): void;
  onSendMessageState?(messageId: number, state: CHANNEL_MESSAGE_STATE): void;
  onSendMessageResult?(
    messageId: number,
    state: CHANNEL_MESSAGE_ERR_CODE
  ): void;
  onMemberJoined?(member: IChannelMember): void;
  onMemberLeft?(member: IChannelMember): void;
  onMembersGotten?(members: IChannelMember[], userCount: number): void;
  onAttributesUpdated?(attributes: IChannelAttributes[]): void;
  onUpdateAttributesResponse?(requestId: number, resCode: RESPONSE_CODE): void;
  onAttributesDeleted?(attributes: IChannelAttributes[]): void;
  onDeleteAttributesResponse?(requestId: number, resCode: RESPONSE_CODE): void;
}

/**
 * The IChannel class.
 */
export abstract class IChannel {
  abstract setEventHandler(eventHandler: IChannelEventHandler): void;
  abstract join(): number;
  abstract leave(): number;
  abstract sendMessage(message: IMessage[]): number;
  abstract updateAttributes(
    attributes: IChannelAttributes[],
    requestId?: number
  ): number;
  abstract deleteAttributes(
    attributes: IChannelAttributes[],
    requestId?: number
  ): number;
  abstract getId(): string;
  abstract release(): number;
}

/**
 * The IRtmServiceEventHandler class.
 */
export interface IRtmServiceEventHandler {
  onLoginSuccess?(): void;
  onLoginFailure?(errorCode: LOGIN_ERR_CODE): void;
  onLogout?(): void;
  onConnectionStateChanged?(state: CONNECTION_STATE): void;
  onSendMessageState?(messageId: number, state: PEER_MESSAGE_STATE): void;
  onMessageReceivedFromPeer?(peerId: string, message: IMessage[]): void;
}

/**
 * The IRtmService class.
 */
export abstract class IRtmService {
  abstract initialize(
    appId: string,
    eventHandler: IRtmServiceEventHandler
  ): number;
  abstract unregisterObserver(eventHandler: IRtmServiceEventHandler): void;
  abstract release(sync: boolean): number;
  abstract login(token: string, userId: string): number;
  abstract logout(): number;
  abstract sendMessageToPeer(peerId: string, message: IMessage[]): number;
  abstract createChannel(
    channelId: string,
    eventHandler: IChannelEventHandler
  ): IChannel[];
}
