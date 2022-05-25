import * as React from 'react';
import { Easing, Animated } from 'react-native';

import loadingImgUri from '../assets/loading-dots.png';

export default function EverSpinningDots(props) {
  const { current: animation } = React.useRef(new Animated.Value(0));

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.Image
      style={[props.style, { transform: [{ rotate }] }]}
      source={loadingImgUri}
    />
  );
}
