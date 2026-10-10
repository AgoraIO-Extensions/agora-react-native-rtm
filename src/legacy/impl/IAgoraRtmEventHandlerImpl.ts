import { IRtmEventHandler } from '../IAgoraRtmEventHandler';

export function processIRtmEventHandler(
  handler: IRtmEventHandler,
  event: string,
  jsonParams: any
) {
  switch (event) {
    case 'onLinkStateEvent':
      if (handler.onLinkStateEvent !== undefined) {
        handler.onLinkStateEvent(jsonParams.event);
      }
      break;
    case 'onMessageEvent':
      if (handler.onMessageEvent !== undefined) {
        handler.onMessageEvent(jsonParams.event);
      }
      break;
    case 'onPresenceEvent':
      if (handler.onPresenceEvent !== undefined) {
        handler.onPresenceEvent(jsonParams.event);
      }
      break;
    case 'onTopicEvent':
      if (handler.onTopicEvent !== undefined) {
        handler.onTopicEvent(jsonParams.event);
      }
      break;
    case 'onLockEvent':
      if (handler.onLockEvent !== undefined) {
        handler.onLockEvent(jsonParams.event);
      }
      break;
    case 'onStorageEvent':
      if (handler.onStorageEvent !== undefined) {
        handler.onStorageEvent(jsonParams.event);
      }
      break;
    case 'onTokenEvent':
      if (handler.onTokenEvent !== undefined) {
        handler.onTokenEvent(jsonParams.event);
      }
      break;
    case 'onJoinResult':
      if (handler.onJoinResult !== undefined) {
        handler.onJoinResult(
          jsonParams.requestId,
          jsonParams.channelName,
          jsonParams.userId,
          jsonParams.errorCode
        );
      }
      break;
    case 'onLeaveResult':
      if (handler.onLeaveResult !== undefined) {
        handler.onLeaveResult(
          jsonParams.requestId,
          jsonParams.channelName,
          jsonParams.userId,
          jsonParams.errorCode
        );
      }
      break;
    case 'onPublishTopicMessageResult':
      if (handler.onPublishTopicMessageResult !== undefined) {
        handler.onPublishTopicMessageResult(
          jsonParams.requestId,
          jsonParams.channelName,
          jsonParams.topic,
          jsonParams.errorCode
        );
      }
      break;
    case 'onJoinTopicResult':
      if (handler.onJoinTopicResult !== undefined) {
        handler.onJoinTopicResult(
          jsonParams.requestId,
          jsonParams.channelName,
          jsonParams.userId,
          jsonParams.topic,
          jsonParams.meta,
          jsonParams.errorCode
        );
      }
      break;
    case 'onLeaveTopicResult':
      if (handler.onLeaveTopicResult !== undefined) {
        handler.onLeaveTopicResult(
          jsonParams.requestId,
          jsonParams.channelName,
          jsonParams.userId,
          jsonParams.topic,
          jsonParams.meta,
          jsonParams.errorCode
        );
      }
      break;
    case 'onSubscribeTopicResult':
      if (handler.onSubscribeTopicResult !== undefined) {
        handler.onSubscribeTopicResult(
          jsonParams.requestId,
          jsonParams.channelName,
          jsonParams.userId,
          jsonParams.topic,
          jsonParams.succeedUsers,
          jsonParams.failedUsers,
          jsonParams.errorCode
        );
      }
      break;
    case 'onUnsubscribeTopicResult':
      if (handler.onUnsubscribeTopicResult !== undefined) {
        handler.onUnsubscribeTopicResult(
          jsonParams.requestId,
          jsonParams.channelName,
          jsonParams.topic,
          jsonParams.errorCode
        );
      }
      break;
    case 'onGetSubscribedUserListResult':
      if (handler.onGetSubscribedUserListResult !== undefined) {
        handler.onGetSubscribedUserListResult(
          jsonParams.requestId,
          jsonParams.channelName,
          jsonParams.topic,
          jsonParams.users,
          jsonParams.errorCode
        );
      }
      break;
    case 'onTokenPrivilegeWillExpire':
      if (handler.onTokenPrivilegeWillExpire !== undefined) {
        handler.onTokenPrivilegeWillExpire(jsonParams.channelName);
      }
      break;
    case 'onSubscribeResult':
      if (handler.onSubscribeResult !== undefined) {
        handler.onSubscribeResult(
          jsonParams.requestId,
          jsonParams.channelName,
          jsonParams.errorCode
        );
      }
      break;
    case 'onUnsubscribeResult':
      if (handler.onUnsubscribeResult !== undefined) {
        handler.onUnsubscribeResult(
          jsonParams.requestId,
          jsonParams.channelName,
          jsonParams.errorCode
        );
      }
      break;
    case 'onPublishResult':
      if (handler.onPublishResult !== undefined) {
        handler.onPublishResult(jsonParams.requestId, jsonParams.errorCode);
      }
      break;
    case 'onLoginResult':
      if (handler.onLoginResult !== undefined) {
        handler.onLoginResult(jsonParams.requestId, jsonParams.errorCode);
      }
      break;
    case 'onLogoutResult':
      if (handler.onLogoutResult !== undefined) {
        handler.onLogoutResult(jsonParams.requestId, jsonParams.errorCode);
      }
      break;
    case 'onRenewTokenResult':
      if (handler.onRenewTokenResult !== undefined) {
        handler.onRenewTokenResult(
          jsonParams.requestId,
          jsonParams.serverType,
          jsonParams.channelName,
          jsonParams.errorCode
        );
      }
      break;
    case 'onSetChannelMetadataResult':
      if (handler.onSetChannelMetadataResult !== undefined) {
        handler.onSetChannelMetadataResult(
          jsonParams.requestId,
          jsonParams.channelName,
          jsonParams.channelType,
          jsonParams.errorCode
        );
      }
      break;
    case 'onUpdateChannelMetadataResult':
      if (handler.onUpdateChannelMetadataResult !== undefined) {
        handler.onUpdateChannelMetadataResult(
          jsonParams.requestId,
          jsonParams.channelName,
          jsonParams.channelType,
          jsonParams.errorCode
        );
      }
      break;
    case 'onRemoveChannelMetadataResult':
      if (handler.onRemoveChannelMetadataResult !== undefined) {
        handler.onRemoveChannelMetadataResult(
          jsonParams.requestId,
          jsonParams.channelName,
          jsonParams.channelType,
          jsonParams.errorCode
        );
      }
      break;
    case 'onGetChannelMetadataResult':
      if (handler.onGetChannelMetadataResult !== undefined) {
        handler.onGetChannelMetadataResult(
          jsonParams.requestId,
          jsonParams.channelName,
          jsonParams.channelType,
          jsonParams.data,
          jsonParams.errorCode
        );
      }
      break;
    case 'onSetUserMetadataResult':
      if (handler.onSetUserMetadataResult !== undefined) {
        handler.onSetUserMetadataResult(
          jsonParams.requestId,
          jsonParams.userId,
          jsonParams.errorCode
        );
      }
      break;
    case 'onUpdateUserMetadataResult':
      if (handler.onUpdateUserMetadataResult !== undefined) {
        handler.onUpdateUserMetadataResult(
          jsonParams.requestId,
          jsonParams.userId,
          jsonParams.errorCode
        );
      }
      break;
    case 'onRemoveUserMetadataResult':
      if (handler.onRemoveUserMetadataResult !== undefined) {
        handler.onRemoveUserMetadataResult(
          jsonParams.requestId,
          jsonParams.userId,
          jsonParams.errorCode
        );
      }
      break;
    case 'onGetUserMetadataResult':
      if (handler.onGetUserMetadataResult !== undefined) {
        handler.onGetUserMetadataResult(
          jsonParams.requestId,
          jsonParams.userId,
          jsonParams.data,
          jsonParams.errorCode
        );
      }
      break;
    case 'onSubscribeUserMetadataResult':
      if (handler.onSubscribeUserMetadataResult !== undefined) {
        handler.onSubscribeUserMetadataResult(
          jsonParams.requestId,
          jsonParams.userId,
          jsonParams.errorCode
        );
      }
      break;
    case 'onUnsubscribeUserMetadataResult':
      if (handler.onUnsubscribeUserMetadataResult !== undefined) {
        handler.onUnsubscribeUserMetadataResult(
          jsonParams.requestId,
          jsonParams.userId,
          jsonParams.errorCode
        );
      }
      break;
    case 'onSetLockResult':
      if (handler.onSetLockResult !== undefined) {
        handler.onSetLockResult(
          jsonParams.requestId,
          jsonParams.channelName,
          jsonParams.channelType,
          jsonParams.lockName,
          jsonParams.errorCode
        );
      }
      break;
    case 'onRemoveLockResult':
      if (handler.onRemoveLockResult !== undefined) {
        handler.onRemoveLockResult(
          jsonParams.requestId,
          jsonParams.channelName,
          jsonParams.channelType,
          jsonParams.lockName,
          jsonParams.errorCode
        );
      }
      break;
    case 'onReleaseLockResult':
      if (handler.onReleaseLockResult !== undefined) {
        handler.onReleaseLockResult(
          jsonParams.requestId,
          jsonParams.channelName,
          jsonParams.channelType,
          jsonParams.lockName,
          jsonParams.errorCode
        );
      }
      break;
    case 'onAcquireLockResult':
      if (handler.onAcquireLockResult !== undefined) {
        handler.onAcquireLockResult(
          jsonParams.requestId,
          jsonParams.channelName,
          jsonParams.channelType,
          jsonParams.lockName,
          jsonParams.errorCode,
          jsonParams.errorDetails
        );
      }
      break;
    case 'onRevokeLockResult':
      if (handler.onRevokeLockResult !== undefined) {
        handler.onRevokeLockResult(
          jsonParams.requestId,
          jsonParams.channelName,
          jsonParams.channelType,
          jsonParams.lockName,
          jsonParams.errorCode
        );
      }
      break;
    case 'onGetLocksResult':
      if (handler.onGetLocksResult !== undefined) {
        handler.onGetLocksResult(
          jsonParams.requestId,
          jsonParams.channelName,
          jsonParams.channelType,
          jsonParams.lockDetailList,
          jsonParams.count,
          jsonParams.errorCode
        );
      }
      break;
    case 'onWhoNowResult':
      if (handler.onWhoNowResult !== undefined) {
        handler.onWhoNowResult(
          jsonParams.requestId,
          jsonParams.userStateList,
          jsonParams.count,
          jsonParams.nextPage,
          jsonParams.errorCode
        );
      }
      break;
    case 'onGetOnlineUsersResult':
      if (handler.onGetOnlineUsersResult !== undefined) {
        handler.onGetOnlineUsersResult(
          jsonParams.requestId,
          jsonParams.userStateList,
          jsonParams.count,
          jsonParams.nextPage,
          jsonParams.errorCode
        );
      }
      break;
    case 'onWhereNowResult':
      if (handler.onWhereNowResult !== undefined) {
        handler.onWhereNowResult(
          jsonParams.requestId,
          jsonParams.channels,
          jsonParams.count,
          jsonParams.errorCode
        );
      }
      break;
    case 'onGetUserChannelsResult':
      if (handler.onGetUserChannelsResult !== undefined) {
        handler.onGetUserChannelsResult(
          jsonParams.requestId,
          jsonParams.channels,
          jsonParams.count,
          jsonParams.errorCode
        );
      }
      break;
    case 'onPresenceSetStateResult':
      if (handler.onPresenceSetStateResult !== undefined) {
        handler.onPresenceSetStateResult(
          jsonParams.requestId,
          jsonParams.errorCode
        );
      }
      break;
    case 'onPresenceRemoveStateResult':
      if (handler.onPresenceRemoveStateResult !== undefined) {
        handler.onPresenceRemoveStateResult(
          jsonParams.requestId,
          jsonParams.errorCode
        );
      }
      break;
    case 'onPresenceGetStateResult':
      if (handler.onPresenceGetStateResult !== undefined) {
        handler.onPresenceGetStateResult(
          jsonParams.requestId,
          jsonParams.state,
          jsonParams.errorCode
        );
      }
      break;
    case 'onGetUserOnlineStatusResult':
      if (handler.onGetUserOnlineStatusResult !== undefined) {
        handler.onGetUserOnlineStatusResult(
          jsonParams.requestId,
          jsonParams.status,
          jsonParams.errorCode
        );
      }
      break;
    case 'onGetHistoryMessagesResult':
      if (handler.onGetHistoryMessagesResult !== undefined) {
        handler.onGetHistoryMessagesResult(
          jsonParams.requestId,
          jsonParams.messageList,
          jsonParams.count,
          jsonParams.newStart,
          jsonParams.errorCode
        );
      }
      break;
  }
}
