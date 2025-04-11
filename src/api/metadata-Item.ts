/** @zh-cn
 * RTM 元数据类。你可以调用 {@link createMetadataItem} 方法创建 RTM 元数据实例。
 * @noInheritDoc
 */
/**
 * Class to represent an Rtm metadata. You can call the {@link createMetadataItem} method to create an Rtm Metadata instance.
 * @noInheritDoc
 */

export declare class RtmMetadataItem {
  /** @zh-cn
   * 设置元数据项的键。
   * * @param key 元数据项的键。该字符串不可超过 32 字节。以下为支持的字符集范围:<ul>
   * <li>26 个小写英文字母 a-z</li>
   * <li>26 个大写英文字母 A-Z</li>
   * <li>10 个数字 0-9</li>
   * <li>空格</li>
   * <li>"!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", " {", "}", "|", "~", ","</li>
   * </ul>
   * <p><b>Note</b></p><ul>
   * <li>请不要将 key 设为""，或字符串 "null"。</li>
   * <li>key 不支持 <code>number</code> 类型。建议调用 <code>toString()</code> 方法转化非 string 型 key。</li>
   * </ul>
   */
  /**
   * Sets the key of the metadata item.
   * @param key the key of the metadata item. The string length must be less than 32 bytes with the following character scope:<ul>
   * <li>All lowercase English letters: a to z</li>
   * <li>All uppercase English letters: A to Z</li>
   * <li>All numeric characters: 0 to 9</li>
   * <li>The space character.</li>
   * <li>Punctuation characters and other symbols, including: "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", " {", "}", "|", "~", ","</li>
   * </ul>
   * <p><b>Note</b></p><ul>
   * <li>The key cannot be empty, or set as "" or "null".</li>
   * <li>We do not support key of the <code>number</code> type and recommend using the <code>toString()</code> method to convert your non-string key.</li>
   * </ul>
   *
   */
  setKey(key: string): void;

  /** @zh-cn
   * 获取元数据项的键。
   */
  /**
   * Gets the key of the metadata item.
   */
  getKey(): string;

  /** @zh-cn
   * 设置元数据项的值。
   */
  /**
   * Sets the value of the metadata item.
   */
  setValue(value: string | null): void;

  /** @zh-cn
   * 获取元数据项的值。
   */
  /**
   * Gets the value of the metadata item.
   */
  getValue(): string | null;

  /** @zh-cn
   * 设置元数据项的版本。
   */
  /**
   * Sets the revision of the metadata item.
   */
  setRevision(revision: number): void;

  /** @zh-cn
   * 获取元数据项的版本。
   */
  /**
   * Gets the revision of the metadata item.
   */
  getRevision(): number;

  /** @zh-cn
   * 获取元数据项上次更新时间的时间戳。
   */
  /**
   * Gets the timestamp of when the metadata item was last updated.
   */
  getUpdateTs(): number;

  /** @zh-cn
   * 获取对最新元数据项进行更新的用户的 ID。
   */
  /**
   * Gets the User ID of the user who makes the latest update to the metadata item.
   */
  getAuthorUserId(): string;
}
