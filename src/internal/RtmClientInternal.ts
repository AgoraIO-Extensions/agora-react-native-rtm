import { IRtmEventHandler } from '../IAgoraRtmClient';
import { IRtmLock } from '../IAgoraRtmLock';
import { IRtmPresence } from '../IAgoraRtmPresence';
import { IRtmStorage } from '../IAgoraRtmStorage';
import { IStreamChannel } from '../IAgoraStreamChannel';
import { IRtmClientEvent } from '../extensions/IAgoraRtmClientExtension';
import { IRtmClientImpl } from '../impl/IAgoraRtmClientImpl';

import {
  DeviceEventEmitter,
  EVENT_TYPE,
  EventProcessor,
} from './IrisRtmEngine';
import { RtmLockInternal } from './RtmLockInternal';
import { RtmPresenceInternal } from './RtmPresenceInternal';
import { RtmStorageInternal } from './RtmStorageInternal';
import { StreamChannelInternal } from './StreamChannelInternal';

export class RtmClientInternal extends IRtmClientImpl {
  static _event_handlers: IRtmEventHandler[] = [];

  protected getApiTypeFromPublishWithBuffer(): string {
    return 'RtmClient_publish';
  }

  override createStreamChannel(channelName: string): IStreamChannel {
    super.createStreamChannel(channelName);
    return new StreamChannelInternal(channelName);
  }

  override getPresence(): IRtmPresence {
    return new RtmPresenceInternal();
  }

  override getStorage(): IRtmStorage {
    return new RtmStorageInternal();
  }

  override getLock(): IRtmLock {
    return new RtmLockInternal();
  }

  override release(): number {
    RtmClientInternal._event_handlers = [];
    this.removeAllListeners();
    const ret = super.release();
    return ret;
  }

  addEventListener<EventType extends keyof IRtmClientEvent>(
    eventType: EventType,
    listener: IRtmClientEvent[EventType]
  ): void {
    const callback = (eventProcessor: EventProcessor<any>, data: any) => {
      if (eventProcessor.type(data) !== EVENT_TYPE.IRtmClient) {
        return;
      }
      eventProcessor.func.map((it) => {
        it({ [eventType]: listener }, eventType, data);
      });
    };
    // @ts-ignore
    listener!.agoraCallback = callback;
    DeviceEventEmitter.addListener(eventType, callback);
  }

  removeEventListener<EventType extends keyof IRtmClientEvent>(
    eventType: EventType,
    listener?: IRtmClientEvent[EventType]
  ) {
    DeviceEventEmitter.removeListener(
      eventType,
      // @ts-ignore
      listener?.agoraCallback ?? listener
    );
  }

  removeAllListeners<EventType extends keyof IRtmClientEvent>(
    eventType?: EventType
  ) {
    RtmClientInternal._event_handlers = [];
    DeviceEventEmitter.removeAllListeners(eventType);
  }
}
