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

  const animValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 1,
        duration: 330,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
    ]).start();
  });

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Portal hostName="alert">
      <Animated.View
        style={{
          height,
          width,
          top: 0,
          left: 0,
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
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
              // the next ones are animated values:
              opacity,
              transform: [{ translateY }],
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
