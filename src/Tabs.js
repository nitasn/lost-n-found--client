import * as React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  useWindowDimensions,
  Keyboard,
} from 'react-native';

import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import NotFound from './NotFound';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ChatsScreen from './ChatsScreen';
import FeedStack from './FeedStack';
import MoreStack from './MoreStack';
import globalStyles from './globalStyles';
import ConversationScreen from './ConversationScreen';
import ChatsStack from './ChatsStack';
import * as Linking from 'expo-linking';

const linking = {
  prefixes: [
    'https://lost-n-found-nitsan.herokuapp.com/',
    Linking.createURL('lostnfound://'),
    Linking.createURL('/'), // which one of them works...?
  ],

  // todo PostScreen params are weird...
  // when visiting from a link "server/post/some-id" it's good,
  // but when navigating through the app, the url includes an "undefined" id,
  // and a url-decoded "[Object object]" postViewed

  config: {
    screens: {
      FeedStack: {
        initialRouteName: 'Feed',

        screens: {
          Feed: 'feed',
          ImagesModal: 'images',
          UserModal: 'user',
          FilterPicker: 'filter',
          PostScreen: 'post/:id',
        },
      },

      ChatsStack: {
        initialRouteName: 'ChatsScreen',

        screens: {
          ChatsScreen: 'chats',
          ConversationScreen: 'conversation',
        },
      },

      MoreStack: {
        initialRouteName: 'MorePage',

        screens: {
          MorePage: 'more',
          MyProfile: 'my-profile',
          PostComposer: 'compose-post',
        },
      },

      NotFound: '*',
    },
  },
};

const Tabs = createBottomTabNavigator();

const ref = createNavigationContainerRef();

export default function () {
  const [routeName, setRouteName] = React.useState();

  const shouldHideTabsBar = routeName === 'ConversationScreen';

  return (
    <NavigationContainer
      linking={linking}
      fallback={<Text>Loading...</Text>}
      ref={ref}
      onReady={() => {
        setRouteName(ref.getCurrentRoute().name);
      }}
      onStateChange={() => {
        setRouteName(ref.getCurrentRoute().name);
      }}
    >
      <Tabs.Navigator
        headerMode="screen"
        screenOptions={({ route }) => ({
          // to prevent at tab-bar icon for the not-found page
          tabBarButton: route.name === 'NotFound' ? () => null : undefined,
        })}
      >
        <Tabs.Screen
          name="FeedStack"
          component={FeedStack}
          options={{
            title: 'Items',
            headerShown: false,
            tabBarIcon: ({ size, color, focused }) => (
              <Ionicons
                size={size}
                color={color}
                name={focused ? 'earth-sharp' : 'earth-outline'}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="ChatsStack"
          component={ChatsStack}
          options={{
            title: 'Chats',
            headerShown: false,
            tabBarStyle: shouldHideTabsBar && { display: 'none' },
            safeAreaInsets: {
              bottom: 0,
            },
            tabBarIcon: ({ size, color, focused }) => (
              <Ionicons
                size={size}
                color={color}
                name={focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="MoreStack"
          component={MoreStack}
          options={{
            title: 'More',
            headerShown: false,
            tabBarIcon: ({ size, color, focused }) => (
              <Ionicons
                size={size}
                color={color}
                name={focused ? 'add-circle-sharp' : 'add-circle-outline'}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="NotFound"
          component={NotFound}
          options={{
            title: 'Not Found',
            headerTitleAlign: 'center',
          }}
        />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}
