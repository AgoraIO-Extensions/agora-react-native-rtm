import { SimpleTypeKind } from '@agoraio-extensions/cxx-parser';

module.exports = {
  'agora::rtm::IStreamChannel.getSubscribedUserList': {
    name: 'agora::rtm::UserList',
    source: 'agora::rtm::UserList*',
    kind: SimpleTypeKind.array_t,
    is_const: false,
    is_builtin_type: true,
  },
};
