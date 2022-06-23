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

export default function App() {
  // const [jwt, jwtError] = useJwt(name);

  const jwt = GershonJWT
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


const GershonJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR2Vyc2hvbiIsInByb2ZpbGVQaWNVcmwiOiJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTY1NDQ3NjcyODY3MC05ODljNDFlZWUzMDA_Y3JvcD1lbnRyb3B5JmNzPXRpbnlzcmdiJmZpdD1jcm9wJmZtPWpwZyZoPTQwMCZpeGlkPU1ud3hmREI4TVh4eVlXNWtiMjE4TUh4OGZIeDhmSHg4TVRZMU5EY3dOVEEyTUEmaXhsaWI9cmItMS4yLjEmcT04MCZ3PTQwMCIsImlhdCI6MTY1NDcxODU4OTMzMywiX2lkIjoiNjJhMTAwN2QwMWI3YmY5NGJmZThlZjliIn0.bL6Vqj1reHnb-1p-RwtuKfQgEAXNcgk1GyWo7LEZW8w'; 

