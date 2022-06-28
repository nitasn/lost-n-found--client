import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MorePage from './MorePage';
import MyProfile from './MyProfile';
import PostComposer from './PostComposer';
import MyPosts from './MyPosts';
import PostScreen from './PostScreen';
import ImagesModal from './ImagesModal';

export default function MoreStack() {
  const Stack = React.useMemo(createNativeStackNavigator, []);

  return (
    <Stack.Navigator screenOptions={{ title: 'More', headerTitleAlign: 'center' }}>
      <Stack.Screen name="MorePage" component={MorePage} />
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="PostComposer" component={PostComposer} />
      <Stack.Screen name="MyPosts" component={MyPosts} />
      <Stack.Screen name="PostScreen" component={PostScreen} />
      <Stack.Screen name="ImagesModal" component={ImagesModal} />
    </Stack.Navigator>
  );
}
