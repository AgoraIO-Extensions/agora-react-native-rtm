import { NavigationContainer } from '@react-navigation/native';
import {
  StackScreenProps,
  createStackNavigator,
} from '@react-navigation/stack';
import createAgoraRtmClient, {
  isDebuggable,
  setDebuggable,
} from 'agora-react-native-rtm';
import React, { useEffect } from 'react';
import {
  AppState,
  Keyboard,
  Platform,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Advanced from './advanced';
import Basic from './basic';
import Client from './components/Client';
import { ConfigHeader } from './config/ConfigHeader';
const RootStack = createStackNavigator<any>();
const DATA = [Basic, Advanced];

export default function App() {
  // const [version, setVersion] = useState<SDKBuildInfo>({});

  useEffect(() => {
    const client = createAgoraRtmClient();
    // setVersion(client.getVersion());

    let subscription = AppState.addEventListener('change', (state) => {
      //just for live reload mode To reset the rtm client in Android
      if (state === 'background' && Platform.OS === 'android') {
        client.release();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);
  return (
    <NavigationContainer>
      <SafeAreaView
        style={styles.container}
        onStartShouldSetResponder={(_) => {
          Keyboard.dismiss();
          return false;
        }}
      >
        <RootStack.Navigator screenOptions={{ gestureEnabled: false }}>
          <RootStack.Screen name={'APIExample'} component={Home} />
          {DATA.map((value) =>
            value.data.map(({ name, component }) => {
              const RouteComponent = component;
              return RouteComponent ? (
                <RootStack.Screen
                  name={name}
                  children={() => (
                    <Client>
                      <RouteComponent />
                    </Client>
                  )}
                />
              ) : undefined;
            })
          )}
        </RootStack.Navigator>
        <TouchableOpacity
          onPress={() => {
            setDebuggable(!isDebuggable());
          }}
        >
          <Text style={styles.version}>Powered by Agora RTM SDK</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const AppSectionList = SectionList<any>;

const Home = ({ navigation }: StackScreenProps<any>) => {
  useEffect(() => {
    const headerRight = () => <ConfigHeader />;
    navigation.setOptions({ headerRight });
  }, [navigation]);

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
    <TouchableOpacity onPress={() => navigation.navigate(item.name)}>
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
