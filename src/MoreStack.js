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

import globalStyles from './globalStyles';

import MorePage from './MorePage';

export default function MoreStack() {
  const Stack = React.useMemo(createNativeStackNavigator, []);

  return (
    <Stack.Navigator
      screenOptions={{ title: 'More', presentation: 'modal' }}
    >
      <Stack.Screen name="MorePage" component={MorePage} />
    </Stack.Navigator>
  );
}
