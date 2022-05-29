import 'react-native-gesture-handler'; // must go first

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

import { StatusBar } from 'expo-status-bar';

import Tabs from './src/Tabs';


export default function App() {

  return (
    <>
      <StatusBar style="auto" />
      <Tabs />
    </>
  );
}
/**
 * my posts (make closed)
 * settings - show closed posts
 * 
 * send msg via the app
 * 
 * keep the "closed" badge for 24 hours
 * 
 * clear should look like a link
 * 
 * search or filter?
 * narrow down your search by
 */