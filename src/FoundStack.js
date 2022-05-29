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

import FoundFeed from './FoundFeed';
import globalStyles from './globalStyles';
import ImagesModal from './ImagesModal';
import UserModal from './UserModal';
import FilterPicker from './FilterPicker';

import { FoundContext } from './contexts';

export default function FoundStack() {
  const Stack = React.useMemo(createNativeStackNavigator, []);

  const [postViewed, setPostViewed] = React.useState();
  const [filter, setFilter] = React.useState(null);

  const exposed = { postViewed, setPostViewed, filter, setFilter };

  return (
    <FoundContext.Provider value={exposed}>
      <Stack.Navigator
        screenOptions={{ title: 'Found', presentation: 'modal' }}
      >
        <Stack.Screen name="FoundFeed" component={FoundFeed} />
        <Stack.Screen name="ImagesModal" component={ImagesModal} />
        <Stack.Screen name="UserModal" component={UserModal} />
        <Stack.Screen name="FilterPicker" component={FilterPicker} />
      </Stack.Navigator>
    </FoundContext.Provider>
  );
}
