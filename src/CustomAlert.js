// todo solve dependencies array for animation
// solve bg not full screen on iphone pwa not status bar

import * as React from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from 'react-native';
import globalStyles from './globalStyles';
import useDimensions from './useDimensions';

/**
 * length 0 ---- no alert is shown
 * length 1 ---- one alert is shown, and no alerts were pushed behind it
 * length 2+ --- one alert is shown, and some alerts were pushed behind it
 */
const _stack = [];

export function showCustomAlert(props) {
  _stack.push(props);
  _setProps({ ...props, isShown: true, onClose });
  _reanimate?.();

  function onClose() {
    const { onClose: extOnClose } = _stack.pop();

    const newProps = _stack.length
      ? { ..._stack[_stack.length - 1], isShown: true, onClose }
      : { isShown: false };

    _setProps(newProps);

    extOnClose?.();
  }
}

let _reanimate = undefined;

let _setProps = () =>
  console.warn('cannot set alert props: AlertProvider has not been mounted');

export function AlertProvider({ children }) {
  const [props, setProps] = React.useState({ isShown: false });

  React.useEffect(() => {
    _setProps = setProps;

    return function onUnmount() {
      _setProps = () =>
        console.warn('cannot set alert props: AlertProvider was unmounted');
    };
  }, [setProps]);

  return (
    <>
      {children}
      {props.isShown && <CustomAlert {...props} />}
    </>
  );
}

function CustomAlert({
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

  const [animCount, setAnimCount] = React.useState(0);

  const opacityValue = new Animated.Value(0);
  const scaleValue = new Animated.Value(0);

  React.useEffect(() => {
    _reanimate = () => setAnimCount(count => count + 1);

    return function onUnmount() {
      _reanimate = undefined;
    };
  }, [setAnimCount]);

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
  }, [animCount]);

  const scale = scaleValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  const opacity = opacityValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={{
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 9,
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
            transform: [{ scale }],
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
