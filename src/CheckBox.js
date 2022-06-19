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
  TextInput,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function ({ isChecked, onChange, label, style }) {
  return (
    <TouchableOpacity
      onPress={() => onChange(!isChecked)}
      style={[{ flexDirection: 'row', alignItems: 'center' }, style]}
    >
      <View
        style={{
          // padding: 0.5,
          backgroundColor: isChecked ? 'black' : 'transparent',
          borderWidth: 1.5,
          borderRadius: 4,
          aspectRatio: 1,
          justifyContent: 'center'
        }}
      >
        <Ionicons
          size={16}
          color={isChecked ? 'white' : 'transparent'}
          name={'checkmark-sharp'}
        />
      </View>
      <Text style={{ marginHorizontal: 6, fontSize: 16 }}>{label}</Text>
    </TouchableOpacity>
  );
}
