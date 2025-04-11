/** @zh-cn
 * 文本消息接口，用于发送和接收文本消息。你可以调用 {@link RtmClient.sendMessageToPeer} 或 {@link RtmChannel.sendMessage} 发送点对点类型或频道类型的文本消息。
 */
/**
 * Interface for text messages. You can use this interface to send and receive text messages. You can call {@link RtmClient.sendMessageToPeer} or {@link RtmChannel.sendMessage} to send a peer-to-peer or channel text message.
 */
export interface RtmTextMessage {
  /** @zh-cn
   * 文本消息的内容。最大长度为 32 KB。
   * <p><b>Note</b></p>
   * 文本消息和文字描述的总大小不能超过 32 KB。
   */
  /**
   * Content of the text message. The maximum length is 32 KB.
   * <p><b>Note</b></p>
   * The maximum total length of the text message and the description is 32 KB.
   */
  text: string;

  /** @zh-cn
   * 消息类型。`TEXT` 代表文本消息。
   */
  /**
   * Message type. `TEXT` stands for text messages.
   *
   */
  messageType?: 'TEXT';
  /** @hidden */
  rawMessage?: never;
  /** @hidden */
  description?: never;
}

/** @zh-cn
 * 二进制消息接口，用于发送和接收二进制消息。你可以调用 {@link RtmClient.sendMessageToPeer} 或 {@link RtmChannel.sendMessage} 发送点对点或频道的二进制消息。
 */
/**
 * Interface for raw messages. You can use this interface to send and receive raw messages. You can call {@link RtmClient.sendMessageToPeer} or {@link RtmChannel.sendMessage} to send a peer-to-peer or channel raw message.
 */
export interface RtmRawMessage {
  /** @zh-cn
   * 二进制消息的内容。最大长度为 32 KB。
   * <p><b>Note</b></p>
   * 二进制消息和文字描述的总大小不能超过 32 KB。
   */
  /**
   * Content of the raw message in binary format. The maximum length is 32 KB.
   * <p><b>Note</b></p>
   * The maximum total length of the raw message and the description is 32 KB.
   */
  rawMessage: Uint8Array;

  /** @zh-cn
   * 二进制消息的文字描述。最大长度为 32 KB。
   * <p><b>Note</b></p>
   * 二进制消息和文字描述的总大小不能超过 32 KB。
   */
  /**
   * Description of the raw message. The maximum length is 32 KB.
   * <p><b>Note</b></p>
   * The maximum total length of the raw message and the description is 32 KB.
   */
  description?: string;

  /** @zh-cn
   * 消息类型。`RAW` 代表二进制消息。
   */
  /**
   * Message type. `RAW` stands for raw messages.
   *
   */
  messageType?: 'RAW';
  /** @hidden */
  text?: never;
}

/** @zh-cn
 * 用于表示 RTM 消息的类型别名。RtmMessage 可以是文本消息 {@link RtmTextMessage} ，自定义二进制消息 {@link RtmRawMessage}。
 */
/**
 * Type alias for RTM messages. RtmMessage can be either {@link RtmTextMessage} , {@link RtmRawMessage}.
 */
export type RtmMessage = RtmTextMessage | RtmRawMessage;

/** @zh-cn
 * 用于表示点对点消息发送结果的接口。
 */
/**
 * Interface for the result of delivering the peer-to-peer message.
 */
export interface PeerMessageSendResult {
  /** @zh-cn
   * 该布尔值属性代表消息接收方是否已收到发出的消息。
   *
   * - `true`: 点对点消息发送成功，对方已收到；
   * - `false`: 对方不在线，未收到该消息。
   *
   */
  /**
   * This boolean property indicates whether the remote peer user receives the sent message.
   *
   * - `true`: the peer user receives the message.
   * - `false`: the peer user is offline and does not receive the message.
   *
   */
  hasPeerReceived: boolean;
}

/** @zh-cn
 * 用于管理已接收消息属性的接口。
 */
/**
 * Interface for properties of received messages.
 */
export interface ReceivedMessageProperties {
  /** @zh-cn
   * 消息服务器接收到消息的时间戳，单位为毫秒。
   *
   * <p><b>Note</b></p>
   *
   * <li> 你不能设置时间戳，但是你可以从该时间戳推断出消息的<i>大致</i>发送时间。</li>
   * <li> 时间戳的精度为毫秒。仅用于展示，不建议用于消息的严格排序。</li>
   */
  /**
   * The timestamp (ms) of when the messaging server receives this message.
   *
   * <p><b>Note</b></p>
   *
   * <li> You cannot set this returned timestamp, but you can infer from it the <i>approximate</i> time as to when this message was sent.</li>
   * <li> The returned timestamp is on a millisecond time-scale. It is for demonstration purposes only, not for strict ordering of messages.</li>
   */
  serverReceivedTs: number;
}
