import 'react-native-gesture-handler'; // must go first

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

function ProvideAll({ children, CVs }) {
  return CVs.reduceRight((result, [Context, value]) => {
    return <Context.Provider value={value}>{result}</Context.Provider>;
  }, children);
}

const MINUTE_IN_MILLIS = 1000 * 60;

export default function App() {
  const [jwt, jwtError] = useJwt();
  const location = useLocation({ updateInterval: MINUTE_IN_MILLIS });
  const [allPosts, postsLoadError, refreshPosts] = usePosts();

  if (!jwt) return <WelcomeScreen errorMsg={jwtError} />;

  const pairs = [
    [JwtContext, jwt],
    [LocationContext, location],
    [PostsContext, { allPosts, postsLoadError, refreshPosts }],
  ];

  return (
    <>
      <StatusBar style="auto" />
      <ProvideAll CVs={pairs}>
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
 *
 * search or filter?
 * narrow down your search by
 */
