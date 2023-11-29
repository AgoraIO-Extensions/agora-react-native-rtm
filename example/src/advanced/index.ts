import ChannelMetadata from './ChannelMetadata';
import Lock from './Lock';
import Presence from './Presence';
import StreamChannelChannelMetadata from './StreamChannelChannelMetadata';
import StreamChannelLock from './StreamChannelLock';
import StreamChannelUserMetadata from './StreamChannelUserMetadata';
import UserMetadata from './UserMetadata';
import PublishMessage from './publishMessage';
import PublishTopicMessage from './publishTopicMessage';

const Advanced = {
  title: 'Advanced',
  data: [
    {
      name: 'PublishMessage',
      component: PublishMessage,
    },
    {
      name: 'PublishTopicMessage',
      component: PublishTopicMessage,
    },
    {
      name: 'Presence',
      component: Presence,
    },
    {
      name: 'ChannelMetadata',
      component: ChannelMetadata,
    },
    {
      name: 'UserMetadata',
      component: UserMetadata,
    },
    {
      name: 'Lock',
      component: Lock,
    },
    {
      name: 'StreamChannelChannelMetadata',
      component: StreamChannelChannelMetadata,
    },
    {
      name: 'StreamChannelUserMetadata',
      component: StreamChannelUserMetadata,
    },
    {
      name: 'StreamChannelLock',
      component: StreamChannelLock,
    },
  ],
};
export default Advanced;
