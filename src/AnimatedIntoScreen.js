import * as React from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

export default function ({ children }) {
  const value = new Animated.Value(0);

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(value, {
        toValue: 1,
        duration: 350,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const translateY = value.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const opacity = value.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View style={[styles.view, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  view: {
    width: 300,
    height: 100,
    backgroundColor: 'gray',
  },
});
