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
            paddingTop: 35,
            alignItems: 'center',
            justifyContent: 'center',
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
  return (
    // <TouchableOpacity
    //   onPress={() => setType(type == 'found' ? 'lost' : 'found')}
    //   style={{
    //     flexDirection: 'row',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     position: 'relative',
    //   }}
    // >
    //   <Text
    //     style={{
    //       fontSize: 20,
    //       letterSpacing: 1.3,
    //       textTransform: 'capitalize',
    //       marginHorizontal: 10,
    //     }}
    //   >
    //     <Text style={{ fontWeight: 'bold' }}>{type}</Text> Items
    //   </Text>
    //   <Ionicons
    //     size={20}
    //     color="black"
    //     name="repeat-outline"
    //     // style={{ position: 'absolute', right: -19, top: 2 }}
    //   />
    // </TouchableOpacity>

    <TouchableOpacity
      onPress={() => setType(type == 'found' ? 'lost' : 'found')}
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        ...globalStyles.shadow,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          textTransform: 'capitalize',
          marginHorizontal: 10,
        }}
      >
        <Text style={{ fontWeight: 'bold' }}>{type}</Text> Items
      </Text>
      <Ionicons
        size={22}
        color="black"
        name="repeat-outline"
        style={{
          transform: [{ translateY: 1 }],
        }}
      />
    </TouchableOpacity>
  );
}
