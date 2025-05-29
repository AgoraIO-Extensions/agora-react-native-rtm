import {
  LinkStateEvent,
  LockEvent,
  MessageEvent,
  PresenceEvent,
  StorageEvent,
  TopicEvent,
} from '../legacy/IAgoraRtmClient';

export interface RTMClientEventMap {
  presence: (presenceData: PresenceEvent) => void;
  message: (message: MessageEvent) => void;
  storage: (storageData: StorageEvent) => void;
  lock: (lockInfo: LockEvent) => void;
  topic: (topicEvent: TopicEvent) => void;
  tokenPrivilegeWillExpire: (channelName: string) => void;
  linkState: (linkState: LinkStateEvent) => void;
}

/**
 * @ignore
 */
export function cleanIrisExtraData(data: any): any {
  if (data === null || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => cleanIrisExtraData(item));
  }

  return Object.fromEntries(
    Object.entries(data)
      .filter(([key]) => !key.endsWith('_str'))
      .map(([key, value]) => [key, cleanIrisExtraData(value)])
  );
}

export function processRTMClientEventMap(
  handler: RTMClientEventMap,
  event: string,
  jsonParams: any
) {
  switch (event) {
    case 'presence':
      if (handler.presence !== undefined) {
        handler.presence(cleanIrisExtraData(jsonParams.event));
      }
      break;
    case 'message':
      if (handler.message !== undefined) {
        handler.message(cleanIrisExtraData(jsonParams.event));
      }
      break;
    case 'storage':
      if (handler.storage !== undefined) {
        handler.storage(cleanIrisExtraData(jsonParams.event));
      }
      break;
    case 'lock':
      if (handler.lock !== undefined) {
        handler.lock(cleanIrisExtraData(jsonParams.event));
      }
      break;
    case 'topic':
      if (handler.topic !== undefined) {
        handler.topic(cleanIrisExtraData(jsonParams.event));
      }
      break;
    case 'tokenPrivilegeWillExpire':
      if (handler.tokenPrivilegeWillExpire !== undefined) {
        handler.tokenPrivilegeWillExpire(jsonParams.channelName);
      }
      break;
    case 'linkState':
      if (handler.linkState !== undefined) {
        handler.linkState(cleanIrisExtraData(jsonParams.event));
      }
      break;
  }
}
