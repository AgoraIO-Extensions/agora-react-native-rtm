import createAgoraRtmClient, { RtmConfig } from '../src';
import { RtmPresenceInternal } from '../src/internal/RtmPresenceInternal';

const mockCallApi = jest.fn();
let mockOnEvent: (event: { event: string; data: string }) => void;

jest.mock('../src/specs', () => ({
  __esModule: true,
  default: {
    callApi: (...args: unknown[]) => mockCallApi(...args),
    newIrisRtmEngine: jest.fn(),
    destroyIrisRtmEngine: jest.fn(),
  },
}));

jest.mock('react-native', () => ({
  NativeEventEmitter: class {
    addListener(_name: string, callback: typeof mockOnEvent) {
      mockOnEvent = callback;
    }
  },
}));

const emitStatus = (requestId: number, errorCode: number, status: unknown) => {
  mockOnEvent({
    event: 'RtmEventHandler_onGetUserOnlineStatusResult_eb2c395',
    data: JSON.stringify({ requestId, errorCode, status }),
  });
};

beforeEach(() => {
  mockCallApi.mockReset();
  mockCallApi.mockReturnValue(JSON.stringify({ result: 0, requestId: 42 }));
});

it.each([true, false])(
  'returns online=%s from the native callback',
  async (online) => {
    const result = new RtmPresenceInternal().getUserOnlineStatus('other-user');
    expect(mockCallApi).toHaveBeenCalledWith({
      funcName: 'RtmPresence_getUserOnlineStatus_1fa04dd',
      params: JSON.stringify({ userId: 'other-user' }),
      buffers: [],
    });
    emitStatus(42, 0, { userId: 'other-user', online });
    await expect(result).resolves.toEqual({
      timestamp: 0,
      userId: 'other-user',
      online,
    });
  }
);

it('rejects a failed callback with null status', async () => {
  const result = new RtmPresenceInternal().getUserOnlineStatus('other-user');
  emitStatus(42, -13014, null);
  await expect(result).rejects.toMatchObject({
    operation: 'getUserOnlineStatus',
    errorCode: -13014,
  });
});

it('rejects native submission errors without waiting for a callback', async () => {
  mockCallApi.mockReturnValue(JSON.stringify({ result: -10002 }));
  await expect(
    new RtmPresenceInternal().getUserOnlineStatus('other-user')
  ).rejects.toMatchObject({
    operation: 'getUserOnlineStatus',
    errorCode: -10002,
  });
});

it('passes initialization parameters through the public client factory', () => {
  const parameters = JSON.stringify({ 'rtm.test': true });
  const client = createAgoraRtmClient(
    new RtmConfig({ appId: 'test-app', userId: 'test-user', parameters })
  );
  expect(mockCallApi.mock.calls[0][0].funcName).toBe('RtmClient_create');
  expect(JSON.parse(mockCallApi.mock.calls[0][0].params).config).toMatchObject({
    appId: 'test-app',
    userId: 'test-user',
    parameters,
  });
  const listener = jest.fn();
  client.addEventListener('presence', listener);
  mockOnEvent({
    event: 'RtmEventHandler_onPresenceEvent',
    data: JSON.stringify({ event: { interval: { totalOccupancy: 12 } } }),
  });
  expect(listener).toHaveBeenCalledWith({ interval: { totalOccupancy: 12 } });
  client.release();
});
