# agora-react-native-rtm

[![npm](https://img.shields.io/npm/v/agora-react-native-rtm.svg)](https://www.npmjs.com/package/agora-react-native-rtm)
[![npm](https://img.shields.io/npm/dm/agora-react-native-rtm.svg)](https://www.npmjs.com/package/agora-react-native-rtm)
[![npm](https://img.shields.io/npm/dt/agora-react-native-rtm.svg)](https://www.npmjs.com/package/agora-react-native-rtm)
[![npm](https://img.shields.io/npm/l/agora-react-native-rtm.svg)](LICENSE)

This SDK takes advantage of React Native and Agora RTM SDK on Android && iOS.

## Release Note

[Changelog](CHANGELOG.md)

## Installation

### Installing (React Native >= 0.70.0)

Install `agora-react-native-rtm`(^2.2.3):

```shell script
yarn add agora-react-native-rtm
```

or

```shell script
npm i --save agora-react-native-rtm
```

Go to your **ios** folder and run:

```shell script
pod install
```

## General Usage

```typescript
import { createAgoraRtmClient, RtmConfig } from 'agora-react-native-rtm';

const engine = createAgoraRtmClient(
  new RtmConfig({
    userId: Config.uid,
    appId: Config.appId,
  })
);
```

## Doc

- [API Ref](https://agoraio-extensions.github.io/agora-react-native-rtm/)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
