import { jest } from '@jest/globals';

jest.mock('../specs', () => ({
  callApi: () => {},
  newIrisRtmEngine: () => {},
  destroyIrisRtmEngine: () => {},
}));
