import { IRtmEventHandler } from '../IAgoraRtmClient';
import { IRtmPresence } from '../IAgoraRtmPresence';
import { IStreamChannel } from '../IAgoraStreamChannel';
import { IRtmClientEvent } from '../extensions/IAgoraRtmClientExtension';
import { IRtmClientImpl } from '../impl/IAgoraRtmClientImpl';
import { IRtmPresenceImpl } from '../impl/IAgoraRtmPresenceImpl';

import {
  DeviceEventEmitter,
  EVENT_TYPE,
  EventProcessor,
} from './IrisRtmEngine';
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
    return new IRtmPresenceImpl();
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
