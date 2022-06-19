// import 'react-native-gesture-handler'; // must go first

import * as React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Platform,
  useWindowDimensions,
  Keyboard,
  Alert,
  SafeAreaView,
  TextInput,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import useJwt from './src/useJwt';
import Tabs from './src/Tabs';
import WelcomeScreen from './src/WelcomeScreen';
import useLocation from './src/useLocation';
import usePosts from './src/usePosts';
import { JwtContext, LocationContext, PostsContext } from './src/contexts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from './src/globalStyles';
import WelcomeInsertName from './src/WelcomeInsertName';
import { SERVER_URL } from './src/constants';

function ProvideAll({ children, ContextsAndValues }) {
  return ContextsAndValues.reduceRight((result, [Context, value]) => {
    return <Context.Provider value={value}>{result}</Context.Provider>;
  }, children);
}

 function App2() {
  // return <WelcomeScreen errorMsg={"Oh snap!!!"}/>
  // AsyncStorage.setItem('name', "Nitsan")
  // AsyncStorage.setItem('jwt', NitsanJWT)

  // AsyncStorage.removeItem('jwt')
  // AsyncStorage.removeItem('name')
  // return <Text>
  //   {'\n\n\n\n'}
  //   {'\n\n\n\n'}
  //   {'\n\n\n\n'}
  //   Clear Start...
  // </Text>

  const [name, setName] = React.useState();

  if (!name) return <WelcomeInsertName onName={setName} />;

  // return <RealApp name={name} />;
}

export default function App({ name }) {
  // const [jwt, jwtError] = useJwt(name);

  const jwt = Platform.OS == 'ios' ? GershonJWT : JonathanJWT;
  const jwtError = null;

  const location = useLocation();
  const [allPosts, postsLoadError, refreshPosts] = usePosts();

  if (!jwt) return <WelcomeScreen errorMsg={jwtError} />;

  const CVs = [
    [JwtContext, jwt],
    [LocationContext, location],
    [PostsContext, { allPosts, postsLoadError, refreshPosts }],
  ];

  return (
    <>
      <StatusBar style="auto" />
      <ProvideAll ContextsAndValues={CVs}>
        <Tabs />
      </ProvideAll>
    </>
  );
}

/**
 * todos
 *
 * my posts (make closed)
 * settings - show closed posts
 *
 * send msg via the app
 *
 * keep the "closed" badge for 24 hours
 */

/**
 * what i've done
 *
 * web view of a post
 * insert name at first time
 */

const NitsanJWT = `
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTml0c2FuIiwicHJvZmlsZVBpY1VybCI6Imh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNjUzNTgwNTU5MzgwLWU0NGU0NWQyODkzZT9jcm9wPWVudHJvcHkmY3M9dGlueXNyZ2ImZml0PWNyb3AmZm09anBnJmg9NDAwJml4aWQ9TW53eGZEQjhNWHh5WVc1a2IyMThNSHg4Zkh4OGZIeDhNVFkxTXpreE5qUXpOQSZpeGxpYj1yYi0xLjIuMSZxPTgwJnc9NDAwIiwiaWF0IjoxNjUzOTE2NDM0NDY0LCJfaWQiOiI2Mjk0YzMxMmZmODYzNDkxY2MyZDNhMDUifQ.r0yXpA1Dr01UHuySEcXvvyLQm-u-EbmSgZPZsQ-ZRAo
`;

const GershonJWT = `
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR2Vyc2hvbiIsInByb2ZpbGVQaWNVcmwiOiJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTY1NDQ3NjcyODY3MC05ODljNDFlZWUzMDA_Y3JvcD1lbnRyb3B5JmNzPXRpbnlzcmdiJmZpdD1jcm9wJmZtPWpwZyZoPTQwMCZpeGlkPU1ud3hmREI4TVh4eVlXNWtiMjE4TUh4OGZIeDhmSHg4TVRZMU5EY3dOVEEyTUEmaXhsaWI9cmItMS4yLjEmcT04MCZ3PTQwMCIsImlhdCI6MTY1NDcxODU4OTMzMywiX2lkIjoiNjJhMTAwN2QwMWI3YmY5NGJmZThlZjliIn0.pCtZSLmyptvEWDHfrE3kLcCvaLP955-axhmysJRS59M
`; // ios

const JonathanJWT = `
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9uYXRoYW4iLCJwcm9maWxlUGljVXJsIjoiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2NTI3MTcyMDQwNzctNzRjZmYzN2I5ODg0P2Nyb3A9ZW50cm9weSZjcz10aW55c3JnYiZmaXQ9Y3JvcCZmbT1qcGcmaD00MDAmaXhpZD1Nbnd4ZkRCOE1YeHlZVzVrYjIxOE1IeDhmSHg4Zkh4OE1UWTFORGt4TkRnMU5BJml4bGliPXJiLTEuMi4xJnE9ODAmdz00MDAiLCJpYXQiOjE2NTUwMjc3MDM0NjEsIl9pZCI6IjYyYTViN2Y3YzcyMWMyZDRjNWU3ZDIxZSJ9.D8CMxYpD6WdmcNXng3SMRsMglYZa7oYLFX8_ftL3zzk
`; // android
