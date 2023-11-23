import { Buffer } from 'buffer';

import base64 from 'base64-js';

import EventEmitter from 'eventemitter3';
import { NativeEventEmitter } from 'react-native';

import { IRtmEventHandler, RtmConfig } from '../IAgoraRtmClient';
import { IRtmClientEvent } from '../extensions/IAgoraRtmClientExtension';
import { processIRtmEventHandler } from '../impl/IAgoraRtmClientImpl';
import { createAgoraRtmClient } from '../index';
import AgoraRtmNg from '../specs';

import { RtmClientInternal } from './RtmClientInternal';
import { StreamChannelInternal } from './StreamChannelInternal';

export type IrisApiParam = {
  funcName: string;
  params: string;
  buffers?: string[];
};

// @ts-ignore
export const DeviceEventEmitter: EventEmitter = new EventEmitter();

const AgoraEventEmitter = new NativeEventEmitter(AgoraRtmNg);
AgoraEventEmitter.addListener('AgoraRtmNg:onEvent', handleEvent);

let debuggable = false;

/**
 * @internal
 */
export function setDebuggable(flag: boolean) {
  debuggable = flag;
}

/**
 * @internal
 */
export function isDebuggable() {
  return debuggable && __DEV__;
}

/**
 * @internal
 */
export type EventProcessor<T extends ProcessorType> = {
  suffix: string;
  type: (data: any) => EVENT_TYPE;
  func: Function[];
  preprocess?: (event: string, data: any, buffers: Uint8Array[]) => void;
  handlers: (data: any) => (T | undefined)[] | undefined;
};

export enum EVENT_TYPE {
  IRtmClient,
}

type ProcessorType = IRtmEventHandler;

type EventProcessors = {
  IRtmEventHandler: EventProcessor<IRtmEventHandler>;
};

/**
 * @internal
 */
export const EVENT_PROCESSORS: EventProcessors = {
  IRtmEventHandler: {
    suffix: 'RtmEventHandler_',
    type: () => EVENT_TYPE.IRtmClient,
    func: [processIRtmEventHandler],
    handlers: () => RtmClientInternal._event_handlers,
    preprocess: (
      event: string,
      data: { event: { message?: string } },
      buffers: Uint8Array[]
    ) => {
      switch (event) {
        case 'onMessageEvent':
          data.event.message = buffers[0]?.toString();
      }
      return { event, data, buffers };
    },
  },
};

function handleEvent({ event, data, buffers }: any) {
  if (debuggable) {
    console.info('onEvent', event, data, buffers);
  }

  let _data: any;
  try {
    _data = JSON.parse(data) ?? {};
  } catch (e) {
    _data = {};
  }

  let _event: string = event;
  let processor: EventProcessor<any> = EVENT_PROCESSORS.IRtmEventHandler;

  Object.values(EVENT_PROCESSORS).some((it) => {
    const p = it as EventProcessor<any>;
    if (
      _event.startsWith(p.suffix) &&
      processor.handlers(_data) !== undefined
    ) {
      processor = p;
      const reg = new RegExp(`^${processor.suffix}`, 'g');
      _event = _event.replace(reg, '');
      return true;
    }
    return false;
  });

  const _buffers: Uint8Array[] = (buffers as string[])?.map((value) => {
    return Buffer.from(value, 'base64');
  });
  if (processor.preprocess) {
    processor.preprocess(_event, _data, _buffers);
  }

  if (processor.handlers) {
    processor.handlers(_data)?.map((value) => {
      if (value) {
        processor.func.map((it) => {
          it(value, _event, _data);
        });
      }
    });
  }

  emitEvent(_event, processor, _data);
}

/**
 * @internal
 */
export function callIrisApi(this: any, funcName: string, params: any): any {
  try {
    const buffers: string[] = [];

    if (funcName.startsWith('StreamChannel_')) {
      params.channelName = (this as StreamChannelInternal).channelName;
      const json = params.toJSON?.call();
      params.toJSON = function () {
        return { ...json, channelName: params.channelName };
      };
    }
    if (
      funcName === 'RtmClient_publish' ||
      funcName === 'StreamChannel_publishTopicMessage'
    ) {
      if (typeof params.message === 'string') {
        let buffer = base64.fromByteArray(
          Buffer.from(params.message ?? '') ?? Buffer.from('')
        );
        buffers.push(buffer);
        params.length = base64.byteLength(buffer);
      } else {
        let buffer = base64.fromByteArray(params.message ?? Buffer.from(''));
        buffers.push(buffer);
        params.length = base64.byteLength(buffer);
      }
      delete params.message;
      const json = params.toJSON?.call();
      delete json.message;
      params.toJSON = function () {
        return { ...json, length: params.length };
      };
    }

    // RTM_ERROR_DUPLICATE_OPERATION

    if (funcName === 'RtmClient_initialize') {
      let config: RtmConfig = params.config;
      if (config?.eventHandler) {
        let rtmClient = createAgoraRtmClient();
        Object.entries(config.eventHandler).forEach(([key, value]) => {
          rtmClient.addEventListener(key as keyof IRtmClientEvent, value);
        });
      }
      AgoraRtmNg.newIrisRtmEngine();
    }
    let ret = AgoraRtmNg.callApi({
      funcName,
      params: JSON.stringify(params),
      buffers,
    });
    if (funcName === 'RtmClient_release') {
      AgoraRtmNg.destroyIrisRtmEngine();
    }

    if (ret !== undefined && ret !== null && ret !== '') {
      const retObj = JSON.parse(ret);
      if (isDebuggable()) {
        if (typeof retObj.result === 'number' && retObj.result < 0) {
          console.error('callApi', funcName, JSON.stringify(params), ret);
        } else {
          console.debug('callApi', funcName, JSON.stringify(params), ret);
        }
      }
      return retObj;
    }
  } catch (e) {
    if (isDebuggable()) {
      console.error('callApi', funcName, JSON.stringify(params), e);
    } else {
      console.warn('callApi', funcName, JSON.stringify(params), e);
    }
  }
  return {};
}

/**
 * @internal
 */
export function emitEvent<EventType extends keyof T, T extends ProcessorType>(
  eventType: EventType,
  eventProcessor: EventProcessor<T>,
  data: any
): void {
  DeviceEventEmitter.emit(eventType as string, eventProcessor, data);
}
