import { Overlay } from '@rneui/themed';

import {
  RTM_AREA_CODE,
  RTM_ENCRYPTION_MODE,
  RTM_PROXY_TYPE,
} from 'agora-react-native-rtm';
import React, { useState } from 'react';

import { StyleSheet } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';

import {
  AgoraButton,
  AgoraDivider,
  AgoraDropdown,
  AgoraStyle,
  AgoraTextInput,
} from '../components/ui';
import { enumToItems } from '../utils/index';

import Config from './agora.config';

export const ConfigHeader = () => {
  const [visible, setVisible] = useState(false);
  const [server, setServer] = useState(Config.server);
  const [port, setPort] = useState<number>(Config.port);
  const [areaCode, setAreaCode] = useState<number>(Config.areaCode);
  const [proxyType, setProxyType] = useState<RTM_PROXY_TYPE>(Config.proxyType);
  const [encryptionMode, setEncryptionMode] = useState<number>(
    Config.encryptionMode
  );
  const [encryptionKey, setEncryptionKey] = useState<string>(
    Config.encryptionKey
  );

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <>
      <AgoraButton title="Config" onPress={toggleOverlay} />
      {visible && (
        <>
          <Overlay
            isVisible
            onBackdropPress={() => setVisible(false)}
            overlayStyle={styles.overlay}
          >
            <ScrollView style={AgoraStyle.fullSize}>
              <AgoraDropdown
                items={enumToItems(RTM_PROXY_TYPE)}
                onValueChange={(v) => {
                  setProxyType(v);
                  Config.proxyType = v;
                }}
                title="select proxyType"
                value={proxyType}
              />
              <AgoraDivider />
              <AgoraTextInput
                onChangeText={(text) => {
                  setServer(text);
                  Config.server = text;
                }}
                placeholder="please input server"
                label="server"
                value={server}
              />
              <AgoraDivider />
              <AgoraTextInput
                onChangeText={(text) => {
                  if (!text) return;
                  setPort(parseInt(text, 10));
                  Config.port = parseInt(text, 10);
                }}
                placeholder="please input port"
                label="port"
                value={port?.toString()}
              />
              <AgoraDivider />
              <AgoraDropdown
                items={enumToItems(RTM_AREA_CODE)}
                onValueChange={(v) => {
                  setAreaCode(v);
                  Config.areaCode = v;
                }}
                title="select areaCode"
                value={areaCode}
              />
              <AgoraDivider />
              <AgoraDropdown
                items={enumToItems(RTM_ENCRYPTION_MODE)}
                onValueChange={(v) => {
                  setEncryptionMode(v);
                  Config.encryptionMode = v;
                }}
                title="select encryptionMode"
                value={encryptionMode}
              />
              <AgoraDivider />
              <AgoraTextInput
                onChangeText={(text) => {
                  setEncryptionKey(text);
                  Config.encryptionKey = text;
                }}
                placeholder="please input encryptionKey"
                label="encryptionKey"
                value={encryptionKey}
              />
              <AgoraDivider />
            </ScrollView>
          </Overlay>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  overlay: {
    backgroundColor: 'white',
    width: '100%',
    minHeight: 250,
    maxHeight: 500,
  },
});
