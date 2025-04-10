import { IRtmClient, RtmConfig } from './IAgoraRtmClient';

import { RtmClientInternal } from './internal/RtmClientInternal';

export * from './AgoraRtmBase';
export * from './IAgoraRtmClient';
export * from './IAgoraRtmLock';
export * from './IAgoraRtmPresence';
export * from './IAgoraRtmStorage';
export * from './IAgoraStreamChannel';
export * from './hooks';
export {
  isDebuggable,
  setDebuggable,
  callIrisApi,
} from './internal/IrisRtmEngine';

/**
 * Creates one IRtmClient object.
 *
 * Currently, the Agora RTM SDK v2.x supports creating only one IRtmClient object for each app.
 *
 * @returns
 * One IRtmClient object.
 */
export function createAgoraRtmClient(config: RtmConfig): IRtmClient {
  return new RtmClientInternal(config);
}

export default createAgoraRtmClient;
