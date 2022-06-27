import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MorePage from './MorePage';
import MyProfile from './MyProfile';
import PostComposer from './PostComposer';

export default function MoreStack() {
  const Stack = React.useMemo(createNativeStackNavigator, []);

  return (
    <Stack.Navigator screenOptions={{ title: 'More', headerTitleAlign: 'center' }}>
      <Stack.Screen name="MorePage" component={MorePage} />
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="PostComposer" component={PostComposer} />
    </Stack.Navigator>
  );
}
