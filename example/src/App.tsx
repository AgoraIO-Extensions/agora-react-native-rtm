import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackScreenProps } from '@react-navigation/stack';
import createAgoraRtmClient, {
  RTMClient,
  RTMProvider,
  RtmConfig,
  RtmEncryptionConfig,
  RtmProxyConfig,
  isDebuggable,
  setDebuggable,
} from 'agora-react-native-rtm';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Keyboard,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Advanced from './advanced';
import Basic from './basic';

import { ConfigHeader } from './config/ConfigHeader';
import Config from './config/agora.config';
import * as log from './utils/log';
const RootStack = createNativeStackNavigator<any>();
const DATA = [Basic, Advanced];

type ClientContextType = {
  createClient: () => void;
  releaseClient: () => void;
};

const ClientContext = React.createContext<ClientContextType>({
  createClient: () => {},
  releaseClient: () => {},
});

export default function App() {
  const [client, setClient] = useState<RTMClient | undefined>(undefined);

  const createClient = useCallback(() => {
    try {
      setClient((prevClient) => {
        if (prevClient) {
          prevClient.release();
        }
        return undefined;
      });

      const newClient = createAgoraRtmClient(
        new RtmConfig({
          userId: Config.uid,
          appId: Config.appId,
          areaCode: Config.areaCode,
          proxyConfig: new RtmProxyConfig({
            proxyType: Config.proxyType,
            server: Config.server,
            port: Config.port,
            account: Config.account,
            password: Config.password,
          }),
          encryptionConfig: new RtmEncryptionConfig({
            encryptionMode: Config.encryptionMode,
            encryptionKey: Config.encryptionKey,
            encryptionSalt: Config.encryptionSalt,
          }),
        })
      );
      setClient(newClient);
    } catch (error: any) {
      log.alert(`createAgoraRtmClient error: ${JSON.stringify(error.reason)}`);
    }
  }, []);

  const releaseClient = useCallback(() => {
    setClient((prevClient) => {
      if (prevClient) {
        prevClient.release();
      }
      return undefined;
    });
  }, []);

  useEffect(() => {
    createClient();

    return () => {};
  }, [createClient]);

  const contextValue: ClientContextType = {
    createClient,
    releaseClient,
  };

  return (
    <NavigationContainer>
      <GestureHandlerRootView>
        <SafeAreaView
          style={styles.container}
          onStartShouldSetResponder={(_) => {
            Keyboard.dismiss();
            return false;
          }}
        >
          <ClientContext.Provider value={contextValue}>
            <RootStack.Navigator screenOptions={{ gestureEnabled: false }}>
              <RootStack.Screen name={'APIExample'} component={Home} />
              {client &&
                DATA.map((value) =>
                  value.data.map(({ name, component }) => {
                    const RouteComponent = component;
                    return RouteComponent ? (
                      <RootStack.Screen
                        name={name}
                        children={() => (
                          <RTMProvider client={client}>
                            <RouteComponent />
                          </RTMProvider>
                        )}
                      />
                    ) : undefined;
                  })
                )}
            </RootStack.Navigator>
          </ClientContext.Provider>
          <TouchableOpacity
            onPress={() => {
              setDebuggable(!isDebuggable());
            }}
          >
            <Text style={styles.version}>Powered by Agora RTM SDK</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
}

const AppSectionList = SectionList<any>;

const Home = ({ navigation }: StackScreenProps<any>) => {
  const { createClient, releaseClient } = useContext(ClientContext);

  // Wrap state update functions in event handlers with useCallback to stabilize references
  const handleShow = useCallback(() => {
    releaseClient();
  }, [releaseClient]);

  const handleHide = useCallback(() => {
    createClient();
  }, [createClient]);

  // Use useEffect to set navigation options, avoiding render-time updates
  useEffect(() => {
    const headerRight = () => (
      <ConfigHeader onShow={handleShow} onHide={handleHide} />
    );

    navigation.setOptions({ headerRight });
  }, [navigation, handleShow, handleHide]);

  return (
    <AppSectionList
      sections={DATA}
      keyExtractor={(item, index) => item.name + index}
      renderItem={({ item }) => <Item item={item} navigation={navigation} />}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.header}>{title}</Text>
      )}
    />
  );
};

const Item = ({
  item,
  navigation,
}: Omit<StackScreenProps<any>, 'route'> & { item: any }) => (
  <View style={styles.item}>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(item.name);
        log.logSink.clearData();
      }}
    >
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 10,
    fontSize: 24,
    color: 'white',
    backgroundColor: 'grey',
  },
  item: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    color: 'black',
  },
  version: {
    backgroundColor: '#ffffffdd',
    textAlign: 'center',
  },
});
