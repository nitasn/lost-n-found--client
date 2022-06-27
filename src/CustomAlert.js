// todo check if it's always full screen

// todo if our AlertProvider is not the root node,
// and its parent rerenders,
// while there is an alert shown.
// will it reanimate? probably so.
// will the close button completely fail? maybe.
// i remember seeing a way to cache components...?

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

export function AlertProvider({ children }) {
  const [props, setProps] = React.useState({ isShown: false });

  React.useEffect(() => {
    _setProps = setProps;

    return () => {
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

/**
 * @typedef {Object} CustomAlertProps
 * @property {String} header
 * @property {String} body
 * @property {Function | undefined} onClose
 * @property {String | undefined} backgroundColor
 * @property {String | undefined} textColor
 * @property {String | undefined} buttonTextColor
 * @property {String | undefined} buttonBgColor
 *
 * @param {CustomAlertProps} props
 */
export function showCustomAlert(props) {
  _stack.push(props);
  _setProps({ ...props, isShown: true, onClose: _onClose });
  _reanimate?.();
}

function _onClose() {
  const poppedProps = _stack.pop(); // pop the props of the one being showed

  const props = _stack.length
    ? { ..._stack[_stack.length - 1], isShown: true, onClose: _onClose }
    : { isShown: false };

  _setProps(props);

  poppedProps.onClose?.();
}

/**
 * length 0 ---- no alert is shown
 * length 1 ---- one alert is shown, and no alerts were pushed behind it
 * length 2+ --- one alert is shown, and some alerts were pushed behind it
 */
const _stack = [];

let _reanimate = undefined;

let _setProps = () =>
  console.warn('cannot set alert props: AlertProvider has not been mounted');

function CustomAlert(props) {
  const { width, height } = useDimensions();

  const [totalNumAlerts, setTotalNumAlerts] = React.useState(0);

  const [animations, setAnimations] = React.useState([]);

  const opacityValue = React.useRef(new Animated.Value(0)).current;
  const scaleValue = React.useRef(new Animated.Value(0.7)).current;

  React.useEffect(() => {
    _reanimate = () => setTotalNumAlerts((count) => count + 1);
    return () => (_reanimate = undefined);
  }, [setTotalNumAlerts]);

  React.useEffect(() => {
    setAnimations([
      Animated.sequence([
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 330,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 330,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
      ]),
    ]);
  }, []);

  React.useEffect(() => {
    animations.forEach((anim) => {
      anim.reset();
      anim.start();
    });

    return () => animations.forEach((anim) => anim.stop());
  }, [totalNumAlerts, animations]);

  // some default values:
  props = {
    backgroundColor: 'hsl(195, 44%, 16%)',
    textColor: 'white',
    buttonBgColor: 'rgb(26, 119, 169)',
    buttonTextColor: 'white',
    ...props,
  };

  return (
    <Animated.View
      key={Math.random().toString(36).substring(2)}
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
        opacity: opacityValue,
      }}
    >
      <TouchableWithoutFeedback /* to block touch on the popup itself */>
        <Animated.View
          style={{
            width: Math.min(0.8 * width, 400),
            paddingTop: 26,
            padding: 24,
            backgroundColor: props.backgroundColor,
            borderRadius: 8,
            ...globalStyles.shadow,
            shadowOpacity: 0.3,
            // animation:
            transform: [{ scale: scaleValue }],
          }}
        >
          <Text
            style={{
              fontSize: 24,
              marginBottom: 16,
              textTransform: 'capitalize',
              color: props.textColor,
            }}
          >
            {props.header}
          </Text>
          <Text style={{ marginBottom: 30, color: props.textColor }}>{props.body}</Text>
          <FlatButton
            onPress={props.onClose}
            text="Okay"
            textColor={props.buttonTextColor}
            bgColor={props.buttonBgColor}
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
