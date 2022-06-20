import React from 'react';

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
  SafeAreaView,
  Platform,
} from 'react-native';

import globalStyles from './globalStyles';
import { Ionicons } from '@expo/vector-icons';

export default function ({ type, setType }) {
  return (
    <>
      <View style={{ width: '100%', backgroundColor: 'white' }}>
        <View
          style={{
            paddingBottom: 18,
            paddingTop: Platform.OS == 'web' ? 18 : 35,
          }}
        >
          <LostOrFoundSelector type={type} setType={setType} />
        </View>
      </View>
      <View style={{ height: 0.5, width: '100%', backgroundColor: '#bbb' }} />
    </>
  );
}

function LostOrFoundSelector({ type, setType }) {
  const oppositeType = type == 'found' ? 'lost' : 'found';
  return (
    <View
      style={{
        width: '100%',
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 20,
          textTransform: 'capitalize',
          marginHorizontal: 10,
          ...globalStyles.shadow,
        }}
      >
        <Text style={{ fontWeight: 'bold' }}>{type}</Text> Items
      </Text>
      <TouchableOpacity
        onPress={() => setType(oppositeType)}
        style={{ flexDirection: 'row' }}
      >

        <Text
          style={{
            fontSize: 16,
            textTransform: 'capitalize',
            marginHorizontal: 5,
            color: 'darkgray',
            transform: [{ translateY: 1 }],
          }}
        >
          Switch
        </Text>

        <Ionicons size={20} color="darkgray" name="swap-horizontal" />

      </TouchableOpacity>
    </View>
  );
}
