import { Buffer } from 'buffer';

import base64 from 'base64-js';

import EventEmitter from 'eventemitter3';
import { NativeEventEmitter } from 'react-native';

import { BaseResponse, ErrorInfo, RTMOperationResponse } from '../api';
import { RTMClientEventMap, processRTMClientEventMap } from '../api/RTMEvents';
import AgoraRtmNg from '../specs';

import { RtmClientInternal } from './RtmClientInternal';
import { StreamChannelInternal } from './StreamChannelInternal';

// Request queue for handling async operations
type RequestItem = {
  resolve: Function;
  reject: Function;
  callbackName: string;
  timeout?: ReturnType<typeof setTimeout>;
};

export class RequestQueue {
  private static _instance: RequestQueue;
  private _requestMap: Map<number, RequestItem> = new Map();

  private constructor() {}

  public static get instance(): RequestQueue {
    if (!RequestQueue._instance) {
      RequestQueue._instance = new RequestQueue();
    }
    return RequestQueue._instance;
  }

  public addRequest(
    callbackName: string,
    timeoutMs: number = 10000,
    externalRequestId: number
  ): Promise<any> & { requestId: number } {
    const requestId = externalRequestId;

    let promiseResolve: Function;
    let promiseReject: Function;

    const promise = new Promise((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject;
    }) as Promise<any> & { requestId: number };

    promise.requestId = requestId;

    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (timeoutMs > 0) {
      timeout = setTimeout(() => {
        const item = this._requestMap.get(requestId);
        if (item) {
          this._requestMap.delete(requestId);
          console.log(`请求超时: ${requestId}`);
          item.reject(
            new Error(`Request ${requestId} timed out after ${timeoutMs}ms`)
          );
        }
      }, timeoutMs);
    }

    this._requestMap.set(requestId, {
      resolve: promiseResolve!,
      reject: promiseReject!,
      callbackName,
      timeout,
    });

    return promise;
  }

  public resolveRequest(
    requestId: number,
    errorCode: number,
    callbackName: string,
    ...args: any[]
  ): boolean {
    const request = this._requestMap.get(requestId);
    if (!request) {
      console.log(`找不到请求 ${requestId}`);
      return false;
    }

    // 检查回调名称是否匹配
    if (request.callbackName !== callbackName) {
      console.log(
        `回调名称不匹配: 期望 ${request.callbackName}, 实际 ${callbackName}`
      );
      return false;
    }

    console.log(
      `解析请求: ${requestId}, 回调: ${callbackName}, 错误码: ${errorCode}`
    );

    if (request.timeout) {
      clearTimeout(request.timeout);
    }

    this._requestMap.delete(requestId);

    if (errorCode === 0) {
      request.resolve(...args);
    } else {
      request.reject(new Error(`Request failed with error code: ${errorCode}`));
    }

    return true;
  }
}

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
  RTMEvent,
}

type ProcessorType = RTMClientEventMap;

type EventProcessors = {
  RTMClientEventMap: EventProcessor<RTMClientEventMap>;
};

/**
 * @internal
 */
export const EVENT_PROCESSORS: EventProcessors = {
  RTMClientEventMap: {
    suffix: 'RtmEventHandler_',
    type: () => EVENT_TYPE.RTMEvent,
    func: [processRTMClientEventMap],
    handlers: () => RtmClientInternal._event_handlers,
    preprocess: (
      event: string,
      data: { event: { message?: string } },
      buffers: Uint8Array[]
    ) => {
      switch (event) {
        case 'onMessageEvent':
          console.log('onMessageEvent', data.event.message, buffers);
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
  let processor: EventProcessor<any> = EVENT_PROCESSORS.RTMClientEventMap;

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

  // for new IrisType, but this is temporary
  if (_event.includes('_')) {
    _event = _event.substring(0, _event.indexOf('_'));
  }

  const _buffers: Uint8Array[] = (buffers as string[])?.map((value) => {
    return Buffer.from(value, 'base64') as unknown as Uint8Array;
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

  // 处理请求解析
  const requestId = _data.requestId;
  if (requestId !== undefined && _data.errorCode !== undefined) {
    const requestQueue = RequestQueue.instance;
    requestQueue.resolveRequest(requestId, _data.errorCode, _event, _data);
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
      funcName === 'RtmClient_publish_2d36e93' ||
      funcName === 'StreamChannel_publishTopicMessage_a31773e'
    ) {
      if (typeof params.message === 'string') {
        let buffer = base64.fromByteArray(
          new Uint8Array(Buffer.from(params.message ?? ''))
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

    if (funcName === 'RtmClient_create') {
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

    if (ret !== undefined && ret !== null && ret !== '' && ret !== 'null') {
      const retObj = JSON.parse(ret);
      if (isDebuggable()) {
        if (typeof retObj.result === 'number' && retObj.result < 0) {
          console.error('callApi', funcName, JSON.stringify(params), ret);
        } else {
          console.log('callApi', funcName, JSON.stringify(params), ret);
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

/**
 * @internal
 */
export async function wrapRtmResult(
  data: any,
  operation: string,
  callbackName: string,
  channelName?: string
): Promise<ErrorInfo | RTMOperationResponse | BaseResponse> {
  if (data.result < 0) {
    throw {
      error: true,
      reason: 'iris call failed',
      operation,
      errorCode: data.result,
    };
  } else {
    const result = await RequestQueue.instance.addRequest(
      callbackName,
      10000,
      data.requestId
    );
    let nativeReturnCode = result.errorCode;
    if (nativeReturnCode === 0) {
      if (channelName) {
        return {
          timestamp: 0,
          channelName,
        };
      } else {
        return {
          timestamp: 0,
        };
      }
    } else {
      throw {
        error: true,
        reason: data.reason,
        operation,
        errorCode: nativeReturnCode,
      };
    }
  }
}

/**
 * @internal
 */
export function handleError(error: any, operation: string): ErrorInfo {
  return {
    error: true,
    reason: JSON.stringify(error),
    operation: operation,
    errorCode: (error as any)?.code,
  };
}
