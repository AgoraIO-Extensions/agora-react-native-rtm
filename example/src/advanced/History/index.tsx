import { RTM_CHANNEL_TYPE, useRtm } from 'agora-react-native-rtm';
import React, { useCallback, useState } from 'react';

import { ScrollView } from 'react-native';

import BaseComponent from '../../components/BaseComponent';
import {
  AgoraButton,
  AgoraDivider,
  AgoraDropdown,
  AgoraStyle,
  AgoraTextInput,
} from '../../components/ui';
import Config from '../../config/agora.config';
import { enumToItems } from '../../utils';
import * as log from '../../utils/log';

export default function History() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [cName, setCName] = useState<string>(Config.channelName);

  const [messageCount, setMessageCount] = useState<number>(100);
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(100);
  const [channelType, setChannelType] = useState<RTM_CHANNEL_TYPE>(
    RTM_CHANNEL_TYPE.RTM_CHANNEL_TYPE_MESSAGE
  );

  /**
   * Step 1: getRtmClient and initialize rtm client from BaseComponent
   */
  const client = useRtm();

  /**
   * Step 1-1 : getHistoryMessages
   */

  const getHistoryMessages = async () => {
    try {
      let result = await client.history.getMessages(cName, channelType, {
        start,
        end,
        messageCount,
      });
      log.info('getHistoryMessages success', result);
    } catch (status: any) {
      log.error('getHistoryMessages error', status);
    }
  };

  const handleLoginStatus = useCallback((status: boolean) => {
    setLoginSuccess(status);
  }, []);

  return (
    <>
      <ScrollView style={AgoraStyle.fullSize}>
        <BaseComponent
          onChannelNameChanged={(v) => setCName(v)}
          onLoginStatusChanged={handleLoginStatus}
        />
        <AgoraDivider />
        <AgoraDropdown
          title={'channelType'}
          items={enumToItems(RTM_CHANNEL_TYPE)}
          value={channelType}
          onValueChange={(value) => {
            setChannelType(value);
          }}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (!text) return;
            setStart(parseInt(text, 10));
          }}
          numberKeyboard
          label="start"
          value={start.toString()}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (!text) return;
            setEnd(parseInt(text, 10));
          }}
          numberKeyboard
          label="end"
          value={end.toString()}
        />
        <AgoraTextInput
          onChangeText={(text) => {
            if (!text) return;
            setMessageCount(parseInt(text, 10));
          }}
          numberKeyboard
          label="message count"
          value={messageCount.toString()}
        />
        <AgoraButton
          title={`getHistoryMessages`}
          disabled={!loginSuccess}
          onPress={() => {
            getHistoryMessages();
          }}
        />
      </ScrollView>
    </>
  );
}
