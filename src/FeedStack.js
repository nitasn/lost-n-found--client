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
} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Feed from './Feed';
import globalStyles from './globalStyles';
import ImagesModal from './ImagesModal';
import UserModal from './UserModal';
import FilterPicker from './FilterPicker';
import { FilterContext } from './contexts';
import TypeChangingHeader from './TypeChangingHeader';
import PostScreen from './PostScreen';

const Stack = createNativeStackNavigator();

export default function () {
  const [type, setType] = React.useState('found');
  const [filter, setFilter] = React.useState(null);

  // used to make the "switch feed type" button change opacity
  // based on the posts list's scroll position
  const [scrollPosition, setScrollPosition] = React.useState(0);

  return (
    <FilterContext.Provider value={{ filter, setFilter }}>
      <Stack.Navigator
        headerMode="screen"
        screenOptions={{
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="Feed"
          options={{
            header: () => <TypeChangingHeader {...{ type, setType, scrollPosition }} />,
          }}
          children={() => <Feed {...{ type, setScrollPosition }} />}
        />
        <Stack.Screen name="ImagesModal" component={ImagesModal} />
        <Stack.Screen name="UserModal" component={UserModal} />
        <Stack.Screen name="FilterPicker" component={FilterPicker} />
        <Stack.Screen name="PostScreen" component={PostScreen} />
      </Stack.Navigator>
    </FilterContext.Provider>
  );
}
