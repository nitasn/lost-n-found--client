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
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import FoundFeed from './FoundFeed';
import globalStyles from './globalStyles';

function FoundStack() {
  const Stack = React.useMemo(createNativeStackNavigator, []);

  return (
    <Stack.Navigator screenOptions={{ title: 'Found' }}>
      <Stack.Screen name="FoundFeed" component={FoundFeed} />
      {/* other screens such as fullscreenuser or sullscreenpost */}
    </Stack.Navigator>
  );
}

/////////////////////////////////////////////////////////////////////

function DebugCountScreen() {
  const [count, setCount] = React.useState(0);

  return (
    <View style={globalStyles.fullScreenAndCenter}>
      <Text>Count: {count}</Text>
      <Button title="increase" onPress={() => setCount(count + 1)} />
    </View>
  );
}

function LostScreen() {
  return (
    <View style={globalStyles.fullScreenAndCenter}>
      <Text>Lost Screen will be here</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={globalStyles.fullScreenAndCenter}>
      <Text>Settings Screen will be here</Text>
    </View>
  );
}

/////////////////////////////////////////////////////////////////////

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
                name={focused ? 'map' : 'map-outline'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="LostTab"
          component={LostScreen}
          options={{
            title: 'Lost',
            // headerShown: false,
            tabBarIcon: ({ size, color, focused }) => (
              <Ionicons
                size={size}
                color={color}
                name={focused ? 'search' : 'search-outline'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="SettingsTab"
          component={SettingsScreen}
          options={{
            title: 'Settings',
            // headerShown: false,
            tabBarIcon: ({ size, color, focused }) => (
              <Ionicons
                size={size}
                color={color}
                name={focused ? 'settings' : 'settings-outline'}
              />
            ),
          }}
        />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}
