import * as React from 'react';
import { Portal } from '@gorhom/portal';
import {
  Button,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from 'react-native';
import globalStyles from './globalStyles';
import useDimensions from './useDimensions';

// todo1 make async (resolve when closed)
// todo2 show up with a transition

export default function (props) {
  if (!props.isShown) return null;

  return <MainThing {...props} />;
}

function MainThing({
  header,
  body,

  onClose,

  backgroundColor,
  textColor,
  buttonTextColor,
  buttonBgColor,
}) {
  if (!backgroundColor) backgroundColor = 'hsl(195, 44%, 16%)';
  if (!textColor) textColor = 'white';
  if (!buttonBgColor) buttonBgColor = 'rgb(26, 119, 169)';
  if (!buttonTextColor) buttonTextColor = 'white';

  const { width, height } = useDimensions();

  const opacityValue = new Animated.Value(0);
  const scaleValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 330,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
    ]).start();

    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 330,
        easing: Easing.elastic(1),
        useNativeDriver: false,
      }),
    ]).start();
  });

  const scale = scaleValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  const opacity = opacityValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Portal hostName="alert">
      <Animated.View
        style={{
          height: '100%',
          width: '100%',
          top: 0,
          left: 0,
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, .15)',
          // animation:
          opacity,
        }}
      >
        <TouchableWithoutFeedback /* to block touch on the popup itself */>
          <Animated.View
            style={{
              width: Math.min(0.8 * width, 400),
              paddingTop: 26,
              padding: 24,
              backgroundColor,
              borderRadius: 8,
              ...globalStyles.shadow,
              shadowOpacity: 0.3,
              // animation:
              transform: [
                { scale },
              ],
            }}
          >
            <Text
              style={{
                fontSize: 24,
                marginBottom: 16,
                textTransform: 'capitalize',
                color: textColor,
              }}
            >
              {header}
            </Text>
            <Text style={{ marginBottom: 30, color: textColor }}>{body}</Text>
            <FlatButton
              onPress={onClose}
              text="Okay"
              textColor={buttonTextColor}
              bgColor={buttonBgColor}
            />
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </Portal>
  );
}

function FlatButton({ text, onPress, textColor, bgColor }) {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: bgColor,
        borderRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignSelf: 'flex-end',
        ...globalStyles.shadow,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          color: textColor,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
