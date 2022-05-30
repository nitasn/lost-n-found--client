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

import { JwtContext, LocationContext } from './src/contexts';

import useLocation from './src/useLocation';

function ProvideAll({ children, CVs }) {
  return CVs.reduceRight((result, [Context, value]) => {
    return <Context.Provider value={value}>{result}</Context.Provider>;
  }, children);
}

export default function App() {
  const [jwt, jwtError] = useJwt();
  const location = useLocation({ updateInterval: 1000 * 60 });

  if (!jwt) return <WelcomeScreen errorMsg={jwtError} />;

  const pairs = [
    [JwtContext, jwt],
    [LocationContext, location],
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
