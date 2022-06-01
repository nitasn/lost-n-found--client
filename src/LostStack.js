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

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LostFeed from './LostFeed';
import globalStyles from './globalStyles';
import ImagesModal from './ImagesModal';
import UserModal from './UserModal';
import FilterPicker from './LostFilterPicker';
import ChatScreen from './ChatScreen';
import { LostContext } from './contexts';

export default function LostStack() {
  const Stack = React.useMemo(createNativeStackNavigator, []);

  const [postViewed, setPostViewed] = React.useState();
  const [filter, setFilter] = React.useState(null);

  const exposed = { postViewed, setPostViewed, filter, setFilter };

  return (
    <LostContext.Provider value={exposed}>
      <Stack.Navigator
        screenOptions={{
          title: 'Lost',
          presentation: 'modal'
        }}
      >
        <Stack.Screen name="LostFeed" component={LostFeed} />
        <Stack.Screen name="ImagesModal" component={ImagesModal} />
        <Stack.Screen name="UserModal" component={UserModal} />
        <Stack.Screen name="FilterPicker" component={FilterPicker} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
      </Stack.Navigator>
    </LostContext.Provider>
  );
}
