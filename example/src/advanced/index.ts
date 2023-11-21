import ChannelMetadata from './ChannelMetadata';
import Presence from './Presence';
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
  ],
};
export default Advanced;
