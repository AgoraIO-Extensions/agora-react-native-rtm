import { Buffer } from 'buffer';

import base64 from 'base64-js';

import createAgoraRtmClient, {
  IRtmClient,
  PublishOptions,
  RTM_MESSAGE_TYPE,
  RtmConfig,
} from '../..';
import AgoraRtmNg from '../../specs';

let rtmClient: IRtmClient;
beforeEach(async () => {
  rtmClient = createAgoraRtmClient();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('callIrisApi', () => {
  test('start with StreamChannel_', () => {
    let param = {
      channelName: 'cname',
    };
    let streamChannel = rtmClient.createStreamChannel(param.channelName);
    jest.spyOn(AgoraRtmNg, 'callApi');
    streamChannel.getChannelName();
    expect(AgoraRtmNg.callApi).toBeCalledTimes(1);
    expect(AgoraRtmNg.callApi).toHaveBeenLastCalledWith({
      buffers: [],
      funcName: 'StreamChannel_getChannelName',
      params: JSON.stringify(param),
    });
  });

  test('RtmClient_initialize', () => {
    jest.spyOn(rtmClient, 'addEventListener');
    jest.spyOn(AgoraRtmNg, 'newIrisRtmEngine');
    jest.spyOn(AgoraRtmNg, 'callApi');
    let rtmConfig = new RtmConfig({
      appId: 'appId',
      userId: 'userId',
      eventHandler: {
        onConnectionStateChanged: jest.fn(),
      },
    });
    rtmClient.initialize(rtmConfig);
    expect(AgoraRtmNg.newIrisRtmEngine).toBeCalledTimes(1);
    expect(rtmClient.addEventListener).toBeCalledTimes(
      Object.entries(rtmConfig.eventHandler!).length
    );
    expect(AgoraRtmNg.callApi).toBeCalledTimes(1);
    expect(AgoraRtmNg.callApi).toBeCalledWith({
      buffers: [],
      funcName: 'RtmClient_initialize',
      params: JSON.stringify({ config: rtmConfig }),
    });
  });

  test('RtmClient_release', () => {
    jest.spyOn(AgoraRtmNg, 'destroyIrisRtmEngine');
    jest.spyOn(AgoraRtmNg, 'callApi');
    rtmClient.release();
    expect(AgoraRtmNg.destroyIrisRtmEngine).toBeCalledTimes(1);
    expect(AgoraRtmNg.callApi).toBeCalledTimes(1);
    expect(AgoraRtmNg.callApi).toBeCalledWith({
      buffers: [],
      funcName: 'RtmClient_release',
      params: '{}',
    });
  });

  test('RtmClient_publish', () => {
    jest.spyOn(AgoraRtmNg, 'callApi');
    let textBuffer = base64.fromByteArray(
      Buffer.from('123') ?? Buffer.from('')
    );
    let param = {
      channelName: 'cname',
      length: base64.byteLength(textBuffer),
      option: new PublishOptions({
        type: RTM_MESSAGE_TYPE.RTM_MESSAGE_TYPE_STRING,
      }),
    };
    rtmClient.publish(param.channelName, '123', 0, param.option);
    expect(AgoraRtmNg.callApi).toBeCalledTimes(1);
    expect(AgoraRtmNg.callApi).toBeCalledWith({
      buffers: [textBuffer],
      funcName: 'RtmClient_publish',
      params: JSON.stringify(param),
    });
  });

  test('StreamChannel_publishTopicMessage', () => {
    jest.spyOn(AgoraRtmNg, 'callApi');
    let textBuffer = base64.fromByteArray(
      Buffer.from('123') ?? Buffer.from('')
    );
    let param = {
      topic: 'tname',
      length: base64.byteLength(textBuffer),
      option: new PublishOptions({
        type: RTM_MESSAGE_TYPE.RTM_MESSAGE_TYPE_STRING,
      }),
      channelName: 'cname',
    };
    let streamChannel = rtmClient.createStreamChannel(param.channelName);
    jest.clearAllMocks();
    streamChannel.publishTopicMessage(param.topic, '123', 0, param.option);
    expect(AgoraRtmNg.callApi).toBeCalledTimes(1);
    expect(AgoraRtmNg.callApi).toHaveBeenLastCalledWith({
      buffers: [textBuffer],
      funcName: 'StreamChannel_publishTopicMessage',
      params: JSON.stringify(param),
    });
  });
});
