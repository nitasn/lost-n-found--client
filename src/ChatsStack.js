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

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from './globalStyles';
import ChatsScreen from './ChatsScreen';
import ConversationScreen from './ConversationScreen';

import { ChatContext } from './contexts';

export default function ({ navigation, route }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      tabBarVisible: getFocusedRouteNameFromRoute(route) === 'ConversationScreen',
    });
  }, [navigation, route]);

  const Stack = React.useMemo(createNativeStackNavigator, []);

  const [currentChatId, setCurrentChatId] = React.useState();
  const [userChattingWith, setUserChattingWith] = React.useState();

  const provided = {
    currentChatId,
    setCurrentChatId,
    userChattingWith,
    setUserChattingWith,
  };

  return (
    <ChatContext.Provider value={provided}>
      <Stack.Navigator screenOptions={{ title: 'Chats', headerTitleAlign: 'center' }}>
        <Stack.Screen name="ChatsScreen" component={ChatsScreen} />
        <Stack.Screen name="ConversationScreen" component={ConversationScreen} />
      </Stack.Navigator>
    </ChatContext.Provider>
  );
}
