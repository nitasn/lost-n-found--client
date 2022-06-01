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

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';


import FoundStack from './FoundStack';
import LostStack from './LostStack';
import MoreStack from './MoreStack';


export default function Tabs() {
  const Tabs = React.useMemo(createBottomTabNavigator, []);

  return (
    <NavigationContainer>
      <Tabs.Navigator>

        <Tabs.Screen
          name="FoundTab"
          component={FoundStack}
          options={{
            title: 'Found',
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
          name="LostTab"
          component={LostStack}
          options={{
            title: 'Lost',
            headerShown: false,
            tabBarIcon: ({ size, color, focused }) => (
              <Ionicons
                size={size}
                color={color}
                name={focused ? 'planet-sharp' : 'planet-outline'}
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
