import * as React from 'react';
import { Text } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import ChatsStack from './ChatsStack';
import FeedStack from './FeedStack';
import MoreStack from './MoreStack';
import NotFound from './NotFound';
import linking from './linking';

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
