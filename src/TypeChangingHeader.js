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

export default function ({ type, setType, scrollPosition }) {
  return (
    <>
      <View style={{ width: '100%', backgroundColor: 'white' }}>
        <View
          style={{
            paddingBottom: 18,
            paddingTop: Platform.OS == 'web' ? 18 : 35,
          }}
        >
          <LostOrFoundSelector {...{ type, setType, scrollPosition }} />
        </View>
      </View>
      <View style={{ height: 0.5, width: '100%', backgroundColor: '#bbb' }} />
    </>
  );
}

function LostOrFoundSelector({ type, setType, scrollPosition }) {
  const oppositeType = type == 'found' ? 'lost' : 'found';
  const [switcherColor, setSwitcherColor] = React.useState('black');
  const [animValue, setAnimValue] = React.useState(0);

  React.useEffect(() => {
    const max = 110;
    const clampedScroll = clamp(0, scrollPosition, max);
    const value = clampedScroll / max;
    setAnimValue(value);
    const lightness = value * 0.7 * 100;

    setSwitcherColor(
      `hsl(201, ${interpolate(40, 0, value)}%, ${interpolate(32, 70, value)}%)`
    );
  }, [scrollPosition]);

  const fontWeight = React.useMemo(() => {
    return (Math.round((700 - animValue * 300) / 100) * 100).toFixed();
  }, [animValue]);

  return (
    <View
      style={{
        width: '100%',
        paddingHorizontal: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
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
        style={{ flexDirection: 'row', marginRight: 3 }}
      >
        <Text
          style={{
            fontSize: 16,
            textTransform: 'capitalize',
            marginHorizontal: 5,
            color: switcherColor,
            fontWeight,
          }}
        >
          View {oppositeType} Items
        </Text>

        <Ionicons size={19} color={switcherColor} name="swap-vertical" />
      </TouchableOpacity>
    </View>
  );
}

function clamp(min, x, max) {
  return Math.max(min, Math.min(x, max));
}

function interpolate(from, to, t) {
  return from + (to - from) * t;
}
