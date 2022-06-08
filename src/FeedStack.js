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

import TypeFeed from './Feed';
import globalStyles from './globalStyles';
import ImagesModal from './ImagesModal';
import UserModal from './UserModal';
import FilterPicker from './FilterPicker';
import ChatScreen from './ChatScreen';
import { FoundContext, LostContext } from './contexts';
import { capitalize } from './utils';

export default function (type) {
  const Stack = createNativeStackNavigator();

  const Feed = TypeFeed(type);

  const Context = type == 'found' ? FoundContext : LostContext;

  return () => {
    const [postViewed, setPostViewed] = React.useState();
    const [filter, setFilter] = React.useState(null);

    return (
      <Context.Provider value={{ postViewed, setPostViewed, filter, setFilter }}>
        <Stack.Navigator
          screenOptions={{
            title: capitalize(type),
            presentation: 'modal',
          }}
        >
          <Stack.Screen name="Feed" component={Feed} />
          <Stack.Screen name="ImagesModal" component={ImagesModal} />
          <Stack.Screen name="UserModal" component={UserModal} />

          <Stack.Screen
            name="FilterPicker"
            children={() => <FilterPicker {...{ filter, setFilter }} />}
          />
        </Stack.Navigator>
      </Context.Provider>
    );
  };
}
