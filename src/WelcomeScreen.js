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

import EverSpinningDots from './EverSpinningDots';

import { Ionicons } from '@expo/vector-icons';

import globalStyles from './globalStyles';

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function randomPastelColor() {
  const [r, g, b] = hsl2rgb(getRandomArbitrary(230, 400), 0.45, 0.75);
  return `rgba(${r}, ${g}, ${b}, .45)`;
}

function hsl2rgb(h, s, l) {
  let a = s * Math.min(l, 1 - l);
  let f = (n, k = (n + h / 30) % 12) =>
    l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  return [f(0), f(8), f(4)].map((x) => Math.round(x * 256));
}

export default function WelcomeScreen({ errorMsg }) {
  const [color, setColor] = React.useState('rgba(179, 195, 230, .4)');

  const [showAnything, setShowAnything] = React.useState(false);

  React.useEffect(() => {
    const id = setTimeout(() => setShowAnything(true), 1000);
    return () => clearTimeout(id);
  }, []);

  // give chance for the jwt to be found...
  if (!showAnything) return <View style={globalStyles.fullScreenAndCenter} />;

  const dots = (
    <TouchableOpacity
      style={{
        padding: 15,
        backgroundColor: color,
        borderRadius: Number.MAX_SAFE_INTEGER,
      }}
      onPress={() => setColor(randomPastelColor())}
    >
      <EverSpinningDots style={{ height: 80, width: 80 }} />
    </TouchableOpacity>
  );

  const boxMsg = (
    <View
      style={{
        paddingHorizontal: 16,
      }}
    >
      <Text style={{ fontSize: 14, color: 'darkgray', fontWeight: 'bold' }}>
        {errorMsg}
      </Text>
    </View>
  );

  return (
    <View
      style={{
        ...globalStyles.fullScreenAndCenter,
        padding: 32,
        backgroundColor: 'lightgray',
        // backgroundColor: 'rgba(139, 163, 239, .3)',
      }}
    >
      <Text
        style={{
          fontSize: 20,
          marginTop: 'auto',
          // color: errorMsg ? 'maroon' : 'gray',
        }}
      >
        {errorMsg
          ? "Couldn't Connect to Server." +
            '\n\n' +
            "Please make sure you're connected to the internt, and try again."
          : 'Connecting to the Server...'}
      </Text>

      <View style={{ marginTop: 'auto' }}>{errorMsg ? boxMsg : dots}</View>
    </View>
  );
}
