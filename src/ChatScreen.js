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
  FlatList,
  TextInput,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import globalStyles from './globalStyles';
import { useFocusEffect } from '@react-navigation/native';
import dummyPosts from './dummyPosts.json';

export default function ({ navigation }) {
  useFocusEffect(() => {
    navigation.setOptions({
      title: 'Chat',
    });
  });

  return (
    <View style={globalStyles.fullScreenAndCenter}>
      <Text>chat screen here</Text>
    </View>
  );
}
