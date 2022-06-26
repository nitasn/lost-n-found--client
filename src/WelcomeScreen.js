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
} from 'react-native';

import globalStyles from './globalStyles';

export default function WelcomeScreen({ errorMsg }) {
  // const [showAnything, setShowAnything] = React.useState(false);

  // React.useEffect(() => {
  //   let destroyed = false;
  //   setTimeout(() => !destroyed && setShowAnything(true), 1000);
  //   return () => (destroyed = true);
  // }, []);

  // // give chance for the jwt to be found...
  // if (!showAnything) return <View style={globalStyles.fullScreenAndCenter} />;

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
          fontSize: 16,
          marginTop: 'auto',
          // color: errorMsg ? 'maroon' : 'gray',
        }}
      >
        {errorMsg
          ? "Couldn't Connect to Server." +
            '\n\n' +
            "Please make sure you're connected to the internt, and try again."
          : 'Getting you in...'}
      </Text>

      <View style={{ marginTop: 'auto' }}>
        {errorMsg && (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{ fontSize: 14, color: 'darkgray', fontWeight: 'bold', marginBottom: 4 }}>
              Error Message:
            </Text>
            <Text style={{ fontSize: 14, color: 'darkgray', fontWeight: 'bold' }}>{errorMsg}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
