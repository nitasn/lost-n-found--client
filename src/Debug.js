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
  Image,
  SafeAreaView,
  Modal,
} from 'react-native';

import jwtDecode from 'jwt-decode';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { JwtContext } from './contexts';
import globalStyles from './globalStyles';
import { prettyDateNoWeekday } from './utils';
import ImagePickerUploader from './ImagePickerUploader';

export default function () {
  return (
    <View style={globalStyles.fullScreenAndCenter}>
      <Text>hello</Text>
    </View>
  );
}

function FlatButton({ color, text, iconName, onPress, revert }) {
  const [border, fg] = revert ? [color, 'white'] : [color, color];

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        borderColor: border,
        borderStyle: 'solid',
        borderRadius: 4,
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 6,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          fontSize: 16,
          marginRight: 7,
          color: fg,
        }}
      >
        {text}
      </Text>

      <Ionicons size={20} color={fg} name={iconName} />
    </TouchableOpacity>
  );
}
