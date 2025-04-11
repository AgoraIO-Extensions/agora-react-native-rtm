export const enum RTMErrorCode {
  /**
   * 0: No error occurs.
   */
  RTM_ERROR_OK = 0,
  /**
   * -10001 ~ -11000 : reserved for generic error.
   * -10001: The SDK is not initialized.
   * only for native
   */
  RTM_ERROR_NOT_INITIALIZED = -10001,
  /**
   * -10002: The user didn't login the RTM system.
   */
  RTM_ERROR_NOT_LOGIN = -10002,
  /**
   * -10003: The app ID is invalid.
   */
  RTM_ERROR_INVALID_APP_ID = -10003,
  /**
   * -10004: The event handler is invalid.
   * only for native
   */
  RTM_ERROR_INVALID_EVENT_HANDLER = -10004,
  /**
   * -10005: The token is invalid.
   */
  RTM_ERROR_INVALID_TOKEN = -10005,
  /**
   * -10006: The user ID is invalid.
   */
  RTM_ERROR_INVALID_USER_ID = -10006,
  /**
   * -10007: The service is not initialized.
   * only for native
   */
  RTM_ERROR_INIT_SERVICE_FAILED = -10007,
  /**
   * -10008: The channel name is invalid.
   */
  RTM_ERROR_INVALID_CHANNEL_NAME = -10008,
  /**
   * -10009: The token has expired.
   */
  RTM_ERROR_TOKEN_EXPIRED = -10009,
  /**
   * -10010: There is no server resources now.
   */
  RTM_ERROR_LOGIN_NO_SERVER_RESOURCES = -10010,
  /**
   * -10011: The login timeout.
   */
  RTM_ERROR_LOGIN_TIMEOUT = -10011,
  /**
   * -10012: The login is rejected by server.
   */
  RTM_ERROR_LOGIN_REJECTED = -10012,
  /**
   * -10013: The login is aborted due to unrecoverable error.
   */
  RTM_ERROR_LOGIN_ABORTED = -10013,
  /**
   * -10014: The parameter is invalid.
   * only for native
   */
  RTM_ERROR_INVALID_PARAMETER = -10014,
  /**
   * -10015: The login is not authorized. Happens user login the RTM system without granted from console.
   */
  RTM_ERROR_LOGIN_NOT_AUTHORIZED = -10015,
  /**
   * -10016: Try to login or join with inconsistent app ID.
   */
  RTM_ERROR_INCONSISTENT_APPID = -10016,
  /**
   * -10017: Already call same request.
   */
  RTM_ERROR_DUPLICATE_OPERATION = -10017,
  /**
   * -10018: Already call destroy or release, this instance is forbidden to call any api, please create new instance.
   * only for native
   */
  RTM_ERROR_INSTANCE_ALREADY_RELEASED = -10018,
  /**
   * -10019: Invalid channel type
   */
  RTM_ERROR_INVALID_CHANNEL_TYPE = -10019,
  /**
   * -10020: Invalid encryption parameter.
   */
  RTM_ERROR_INVALID_ENCRYPTION_PARAMETER = -10020,
  /**
   * -10021: The operation rate exceeds limitation.
   */
  RTM_ERROR_OPERATION_RATE_EXCEED_LIMITATION = -10021,
  /**
   * -10022: The service is not supported.
   */
  RTM_ERROR_SERVICE_NOT_SUPPORTED = -10022,
  /**
   * -10023: The login is canceled.
   */
  RTM_ERROR_LOGIN_CANCELED = -10023,
  /**
   * -10024: The private config is invalid, set private config should both set serviceType and accessPointHosts.
   */
  RTM_ERROR_INVALID_PRIVATE_CONFIG = -10024,
  /**
   * -10025: Perform operation failed due to RTM service is not connected.
   */
  RTM_ERROR_NOT_CONNECTED = -10025,
  /**
   * -10026: Renew token operation timeout.
   */
  RTM_ERROR_RENEW_TOKEN_TIMEOUT = -10026,

  /**
   * -11001 ~ -12000 : reserved for channel error.
   * -11001: The user has not joined the channel.
   */
  RTM_ERROR_CHANNEL_NOT_JOINED = -11001,
  /**
   * -11002: The user has not subscribed the channel.
   */
  RTM_ERROR_CHANNEL_NOT_SUBSCRIBED = -11002,
  /**
   * -11003: The topic member count exceeds the limit.
   */
  RTM_ERROR_CHANNEL_EXCEED_TOPIC_USER_LIMITATION = -11003,
  /**
   * -11004: The channel is reused in RTC.
   * only for native
   */
  RTM_ERROR_CHANNEL_IN_REUSE = -11004,
  /**
   * -11005: The channel instance count exceeds the limit.
   */
  RTM_ERROR_CHANNEL_INSTANCE_EXCEED_LIMITATION = -11005,
  /**
   * -11006: The channel is in error state.
   */
  RTM_ERROR_CHANNEL_IN_ERROR_STATE = -11006,
  /**
   * -11007: The channel join failed.
   */
  RTM_ERROR_CHANNEL_JOIN_FAILED = -11007,
  /**
   * -11008: The topic name is invalid.
   */
  RTM_ERROR_CHANNEL_INVALID_TOPIC_NAME = -11008,
  /**
   * -11009: The message is invalid.
   */
  RTM_ERROR_CHANNEL_INVALID_MESSAGE = -11009,
  /**
   * -11010: The message length exceeds the limit.
   */
  RTM_ERROR_CHANNEL_MESSAGE_LENGTH_EXCEED_LIMITATION = -11010,
  /**
   * -11011: The user list is invalid.
   * only for native
   */
  RTM_ERROR_CHANNEL_INVALID_USER_LIST = -11011,
  /**
   * -11012: The stream channel is not available.
   */
  RTM_ERROR_CHANNEL_NOT_AVAILABLE = -11012,
  /**
   * -11013: The topic is not subscribed.
   */
  RTM_ERROR_CHANNEL_TOPIC_NOT_SUBSCRIBED = -11013,
  /**
   * -11014: The topic count exceeds the limit.
   */
  RTM_ERROR_CHANNEL_EXCEED_TOPIC_LIMITATION = -11014,
  /**
   * -11015: Join topic failed.
   */
  RTM_ERROR_CHANNEL_JOIN_TOPIC_FAILED = -11015,
  /**
   * -11016: The topic is not joined.
   */
  RTM_ERROR_CHANNEL_TOPIC_NOT_JOINED = -11016,
  /**
   * -11017: The topic does not exist.
   */
  RTM_ERROR_CHANNEL_TOPIC_NOT_EXIST = -11017,
  /**
   * -11018: The topic meta is invalid.
   */
  RTM_ERROR_CHANNEL_INVALID_TOPIC_META = -11018,
  /**
   * -11019: Subscribe channel timeout.
   */
  RTM_ERROR_CHANNEL_SUBSCRIBE_TIMEOUT = -11019,
  /**
   * -11020: Subscribe channel too frequent.
   */
  RTM_ERROR_CHANNEL_SUBSCRIBE_TOO_FREQUENT = -11020,
  /**
   * -11021: Subscribe channel failed.
   */
  RTM_ERROR_CHANNEL_SUBSCRIBE_FAILED = -11021,
  /**
   * -11022: Unsubscribe channel failed.
   * only for native
   */
  RTM_ERROR_CHANNEL_UNSUBSCRIBE_FAILED = -11022,
  /**
   * -11023: Encrypt message failed.
   */
  RTM_ERROR_CHANNEL_ENCRYPT_MESSAGE_FAILED = -11023,
  /**
   * -11024: Publish message failed.
   */
  RTM_ERROR_CHANNEL_PUBLISH_MESSAGE_FAILED = -11024,
  /**
   * -11025: Publish message too frequent.
   */
  RTM_ERROR_CHANNEL_PUBLISH_MESSAGE_TOO_FREQUENT = -11025,
  /**
   * -11026: Publish message timeout.
   */
  RTM_ERROR_CHANNEL_PUBLISH_MESSAGE_TIMEOUT = -11026,
  /**
   * -11027: The connection state is invalid.
   * only for native
   */
  RTM_ERROR_CHANNEL_NOT_CONNECTED = -11027,
  /**
   * -11028: Leave channel failed.
   */
  RTM_ERROR_CHANNEL_LEAVE_FAILED = -11028,
  /**
   * -11029: The custom type length exceeds the limit.
   */
  RTM_ERROR_CHANNEL_CUSTOM_TYPE_LENGTH_OVERFLOW = -11029,
  /**
   * -11030: The custom type is invalid.
   */
  RTM_ERROR_CHANNEL_INVALID_CUSTOM_TYPE = -11030,
  /**
   * -11031: unsupported message type (in MacOS/iOS platform，message only support NSString and NSData)
   * only for native
   */
  RTM_ERROR_CHANNEL_UNSUPPORTED_MESSAGE_TYPE = -11031,
  /**
   * -11032: The channel presence is not ready.
   * only for native
   */
  RTM_ERROR_CHANNEL_PRESENCE_NOT_READY = -11032,
  /**
   * -11033: The destination user of publish message is offline.
   */
  RTM_ERROR_CHANNEL_RECEIVER_OFFLINE = -11033,
  /**
   * -11034: The channel join operation is canceled.
   */
  RTM_ERROR_CHANNEL_JOIN_CANCELED = -11034,
  /**
   * -11035: The message receiver is offline but the message store in history succeeded.
   */
  RTM_ERROR_CHANNEL_RECEIVER_OFFLINE_BUT_STORE_SUCCEEDED = -11035,
  /**
   * -11036: The message receiver is offline and the message store in history failed.
   */
  RTM_ERROR_CHANNEL_RECEIVER_OFFLINE_AND_STORE_FAILED = -11036,
  /**
   * -11037: The message delivered successfully but store in history failed.
   */
  RTM_ERROR_CHANNEL_MESSAGE_DELIVERED_BUT_STORE_FAILED = -11037,

  /**
   * -12001 ~ -13000 : reserved for storage error.
   * -12001: The storage operation failed.
   */
  RTM_ERROR_STORAGE_OPERATION_FAILED = -12001,
  /**
   * -12002: The metadata item count exceeds the limit.
   */
  RTM_ERROR_STORAGE_METADATA_ITEM_EXCEED_LIMITATION = -12002,
  /**
   * -12003: The metadata item is invalid.
   */
  RTM_ERROR_STORAGE_INVALID_METADATA_ITEM = -12003,
  /**
   * -12004: The argument in storage operation is invalid.
   */
  RTM_ERROR_STORAGE_INVALID_ARGUMENT = -12004,
  /**
   * -12005: The revision in storage operation is invalid.
   */
  RTM_ERROR_STORAGE_INVALID_REVISION = -12005,
  /**
   * -12006: The metadata length exceeds the limit.
   */
  RTM_ERROR_STORAGE_METADATA_LENGTH_OVERFLOW = -12006,
  /**
   * -12007: The lock name in storage operation is invalid.
   */
  RTM_ERROR_STORAGE_INVALID_LOCK_NAME = -12007,
  /**
   * -12008: The lock in storage operation is not acquired.
   */
  RTM_ERROR_STORAGE_LOCK_NOT_ACQUIRED = -12008,
  /**
   * -12009: The metadata key is invalid.
   */
  RTM_ERROR_STORAGE_INVALID_KEY = -12009,
  /**
   * -12010: The metadata value is invalid.
   */
  RTM_ERROR_STORAGE_INVALID_VALUE = -12010,
  /**
   * -12011: The metadata key length exceeds the limit.
   */
  RTM_ERROR_STORAGE_KEY_LENGTH_OVERFLOW = -12011,
  /**
   * -12012: The metadata value length exceeds the limit.
   */
  RTM_ERROR_STORAGE_VALUE_LENGTH_OVERFLOW = -12012,
  /**
   * -12013: The metadata key already exists.
   * only for native
   */
  RTM_ERROR_STORAGE_DUPLICATE_KEY = -12013,
  /**
   * -12014: The revision in storage operation is outdated.
   */
  RTM_ERROR_STORAGE_OUTDATED_REVISION = -12014,
  /**
   * -12015: The storage operation performed without subscribing.
   */
  RTM_ERROR_STORAGE_NOT_SUBSCRIBE = -12015,
  /**
   * -12016: The metadata item is invalid.
   * only for native
   */
  RTM_ERROR_STORAGE_INVALID_METADATA_INSTANCE = -12016,
  /**
   * -12017: The user count exceeds the limit when try to subscribe.
   */
  RTM_ERROR_STORAGE_SUBSCRIBE_USER_EXCEED_LIMITATION = -12017,
  /**
   * -12018: The storage operation timeout.
   */
  RTM_ERROR_STORAGE_OPERATION_TIMEOUT = -12018,
  /**
   * -12019: The storage service not available.
   */
  RTM_ERROR_STORAGE_NOT_AVAILABLE = -12019,

  /**
   * -13001 ~ -14000 : reserved for presence error.
   * -13001: The user is not connected.
   */
  RTM_ERROR_PRESENCE_NOT_CONNECTED = -13001,
  /**
   * -13002: The presence is not writable.
   * only for native
   */
  RTM_ERROR_PRESENCE_NOT_WRITABLE = -13002,
  /**
   * -13003: The argument in presence operation is invalid.
   */
  RTM_ERROR_PRESENCE_INVALID_ARGUMENT = -13003,
  /**
   * -13004: The cached presence state count exceeds the limit.
   */
  RTM_ERROR_PRESENCE_CACHED_TOO_MANY_STATES = -13004,
  /**
   * -13005: The state count exceeds the limit.
   */
  RTM_ERROR_PRESENCE_STATE_COUNT_OVERFLOW = -13005,
  /**
   * -13006: The state key is invalid.
   */
  RTM_ERROR_PRESENCE_INVALID_STATE_KEY = -13006,
  /**
   * -13007: The state value is invalid.
   * only for native
   */
  RTM_ERROR_PRESENCE_INVALID_STATE_VALUE = -13007,
  /**
   * -13008: The state key length exceeds the limit.
   */
  RTM_ERROR_PRESENCE_STATE_KEY_SIZE_OVERFLOW = -13008,
  /**
   * -13009: The state value length exceeds the limit.
   */
  RTM_ERROR_PRESENCE_STATE_VALUE_SIZE_OVERFLOW = -13009,
  /**
   * -13010: The state key already exists.
   */
  RTM_ERROR_PRESENCE_STATE_DUPLICATE_KEY = -13010,
  /**
   * -13011: The user is not exist.
   */
  RTM_ERROR_PRESENCE_USER_NOT_EXIST = -13011,
  /**
   * -13012: The presence operation timeout.
   */
  RTM_ERROR_PRESENCE_OPERATION_TIMEOUT = -13012,
  /**
   * -13013: The presence operation failed.
   */
  RTM_ERROR_PRESENCE_OPERATION_FAILED = -13013,

  /**
   * -14001 ~ -15000 : reserved for lock error.
   * -14001: The lock operation failed.
   */
  RTM_ERROR_LOCK_OPERATION_FAILED = -14001,
  /**
   * -14002: The lock operation timeout.
   */
  RTM_ERROR_LOCK_OPERATION_TIMEOUT = -14002,
  /**
   * -14003: The lock operation is performing.
   */
  RTM_ERROR_LOCK_OPERATION_PERFORMING = -14003,
  /**
   * -14004: The lock already exists.
   */
  RTM_ERROR_LOCK_ALREADY_EXIST = -14004,
  /**
   * -14005: The lock name is invalid.
   */
  RTM_ERROR_LOCK_INVALID_NAME = -14005,
  /**
   * -14006: The lock is not acquired.
   */
  RTM_ERROR_LOCK_NOT_ACQUIRED = -14006,
  /**
   * -14007: Acquire lock failed.
   */
  RTM_ERROR_LOCK_ACQUIRE_FAILED = -14007,
  /**
   * -14008: The lock is not exist.
   */
  RTM_ERROR_LOCK_NOT_EXIST = -14008,
  /**
   * -14009: The lock service is not available.
   */
  RTM_ERROR_LOCK_NOT_AVAILABLE = -14009,
  /**
   * -15001 ~ -16000 : reserved for history error.
   * -15001: The history operation failed.
   */
  RTM_ERROR_HISTORY_OPERATION_FAILED = -15001,
  /**
   * -15002: The timestamp is invalid.
   */
  RTM_ERROR_HISTORY_INVALID_TIMESTAMP = -15002,
  /**
   * -15003: The history operation timeout.
   */
  RTM_ERROR_HISTORY_OPERATION_TIMEOUT = -15003,
  /**
   * -15004: The history operation is not permitted.
   */
  RTM_ERROR_HISTORY_OPERATION_NOT_PERMITTED = -15004,
  /**
   * -15005: The history service not available.
   */
  RTM_ERROR_HISTORY_NOT_AVAILABLE = -15005,
}
