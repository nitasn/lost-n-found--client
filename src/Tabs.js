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
  Alert,
} from 'react-native';

import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ChatsScreen from './ChatsScreen';
import FeedStack from './FeedStack';
import MoreStack from './MoreStack';
import globalStyles from './globalStyles';
import ConversationScreen from './ConversationScreen';
import ChatsStack from './ChatsStack';

const Tabs = createBottomTabNavigator();

const ref = createNavigationContainerRef();

export default function () {
  const [routeName, setRouteName] = React.useState();

  const shouldHideTabsBar = routeName === 'ConversationScreen';

  return (
    <NavigationContainer
      ref={ref}
      onReady={() => {
        setRouteName(ref.getCurrentRoute().name); // do the same on convo screen to scroll down
      }}
      onStateChange={() => {
        setRouteName(ref.getCurrentRoute().name);
      }}
    >
      <Tabs.Navigator headerMode="screen">
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
                name={focused ? 'compass-sharp' : 'compass-outline'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="ChatsTab"
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
          name="MoreTab"
          component={MoreStack}
          options={{
            title: 'More',
            headerShown: false,
            tabBarIcon: ({ size, color, focused }) => (
              <Ionicons
                size={size}
                color={color}
                name={focused ? 'menu-sharp' : 'menu'}
              />
            ),
          }}
        />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}
