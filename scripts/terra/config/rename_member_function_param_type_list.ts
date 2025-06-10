import { SimpleTypeKind } from '@agoraio-extensions/cxx-parser';

module.exports = {
  'agora::rtm::IRtmClient.publish.message@type': {
    name: 'void',
    source: 'void',
    kind: SimpleTypeKind.pointer_t,
    is_const: true,
    is_builtin_type: false,
  },
  'agora::rtm::IStreamChannel.publishTopicMessage.message@type': {
    name: 'void',
    source: 'void',
    kind: SimpleTypeKind.pointer_t,
    is_const: true,
    is_builtin_type: false,
  },
};
