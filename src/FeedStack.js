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

import Feed from './Feed';
import globalStyles from './globalStyles';
import ImagesModal from './ImagesModal';
import UserModal from './UserModal';
import FilterPicker from './FilterPicker';
import { FeedContext } from './contexts';
import TypeChangingHeader from './TypeChangingHeader';
import PostScreen from './PostScreen';

const Stack = createNativeStackNavigator();

export default function () {
  const [postViewed, setPostViewed] = React.useState();
  const [filter, setFilter] = React.useState(null);
  const [type, setType] = React.useState('found');

  const [scrollPosition, setScrollPosition] = React.useState(0);

  const provided = { postViewed, setPostViewed, filter, setFilter, type };

  return (
    <FeedContext.Provider value={provided}>
      <Stack.Navigator
        headerMode="screen"
        screenOptions={{
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="Feed"
          children={() => <Feed {...{ setScrollPosition }} />}
          options={{
            // todo - on type switch - scroll to top
            header: () => <TypeChangingHeader {...{ type, setType, scrollPosition }} />,
          }}
        />
        <Stack.Screen name="ImagesModal" component={ImagesModal} />
        <Stack.Screen name="UserModal" component={UserModal} />
        <Stack.Screen name="FilterPicker" component={FilterPicker} />
        <Stack.Screen name="PostScreen" component={PostScreen} />
      </Stack.Navigator>
    </FeedContext.Provider>
  );
}
