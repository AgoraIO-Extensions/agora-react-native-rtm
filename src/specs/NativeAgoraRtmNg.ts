import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';

export interface Spec extends TurboModule {
  newIrisRtmEngine(): boolean;

  destroyIrisRtmEngine(): boolean;

  callApi(args: {
    funcName: string;
    params: string;
    buffers?: string[];
  }): string;

  // Keep: Required for RN built in Event Emitter Calls.
  addListener(eventName: string): void;

  // Keep: Required for RN built in Event Emitter Calls.
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('AgoraRtmNg');
