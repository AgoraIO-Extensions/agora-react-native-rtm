import { RTMClient } from './api/index';

import { RtmClientInternal } from './internal/RtmClientInternal';
import { RtmConfig } from './legacy/IAgoraRtmClient';

export * from './legacy/AgoraRtmBase';
export * from './legacy/IAgoraRtmClient';
export * from './legacy/IAgoraRtmLock';
export * from './legacy/IAgoraRtmPresence';
export * from './legacy/IAgoraRtmStorage';
export * from './legacy/IAgoraStreamChannel';
export * from './hooks';
export {
  isDebuggable,
  setDebuggable,
  callIrisApi,
} from './internal/IrisRtmEngine';

/**
 * Creates one RTMClient object.
 *
 * Currently, the Agora RTM SDK v2.x supports creating only one RTMClient object for each app.
 *
 * @returns
 * One RTMClient object.
 */
export function createAgoraRtmClient(config: RtmConfig): RTMClient {
  return new RtmClientInternal(config) as unknown as RTMClient;
}

export default createAgoraRtmClient;
