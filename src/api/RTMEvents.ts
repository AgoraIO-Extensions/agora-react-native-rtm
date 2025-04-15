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

export function processRTMClientEventMap(
  handler: RTMClientEventMap,
  event: string,
  jsonParams: any
) {
  switch (event) {
    case 'presence':
      if (handler.presence !== undefined) {
        handler.presence(jsonParams.event);
      }
      break;
    case 'message':
      if (handler.message !== undefined) {
        handler.message(jsonParams.event);
      }
      break;
    case 'storage':
      if (handler.storage !== undefined) {
        handler.storage(jsonParams.event);
      }
      break;
    case 'lock':
      if (handler.lock !== undefined) {
        handler.lock(jsonParams.event);
      }
      break;
    case 'topic':
      if (handler.topic !== undefined) {
        handler.topic(jsonParams.event);
      }
      break;
    case 'tokenPrivilegeWillExpire':
      if (handler.tokenPrivilegeWillExpire !== undefined) {
        handler.tokenPrivilegeWillExpire(jsonParams.channelName);
      }
      break;
    case 'linkState':
      if (handler.linkState !== undefined) {
        handler.linkState(jsonParams.event);
      }
      break;
  }
}
