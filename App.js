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
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import useJwt from './src/useJwt';
import Tabs from './src/Tabs';
import WelcomeScreen from './src/WelcomeScreen';
import useLocation from './src/useLocation';
import usePosts from './src/usePosts';
import { JwtContext, LocationContext, PostsContext } from './src/contexts';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ProvideAll({ children, ContextsAndValues }) {
  return ContextsAndValues.reduceRight((result, [Context, value]) => {
    return <Context.Provider value={value}>{result}</Context.Provider>;
  }, children);
}

export default function App() {
  const [jwt, jwtError] = useJwt();
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
