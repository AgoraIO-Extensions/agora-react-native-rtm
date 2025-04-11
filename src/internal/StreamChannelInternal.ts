import { RTMStreamChannel } from '../api/RTMStreamChannel';

export class StreamChannelInternal extends RTMStreamChannel {
  private readonly _channelName: string = '';

  constructor(channelName: string) {
    super();
    this._channelName = channelName;
  }

  get channelName(): string {
    return this._channelName;
  }
}
