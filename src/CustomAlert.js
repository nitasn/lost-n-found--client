import * as React from 'react';
import { Portal } from '@gorhom/portal';
import {
  Button,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import globalStyles from './globalStyles';

// todo1 make async (resolve when closed)
// todo2 show up with a transition

export default function ({
  header,
  body,
  isShown,
  hide,
  backgroundColor,
  textColor,
  buttonTextColor,
  buttonBgColor,
}) {
  return (
    <Portal hostName="alert">
      <TouchableOpacity
        style={{
          display: isShown ? 'flex' : 'none',
          height: vh(100),
          width: vw(100),
          top: 0,
          left: 0,
          position: 'absolute',
          backgroundColor: 'hsla(0, 0%, 0%, .25)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={hide}
      >
        <TouchableWithoutFeedback /* to block touch on the popup itself */>
          <View
            style={{
              width: Math.min(vw(80), 400),
              paddingHorizontal: 28,
              paddingTop: 26,
              paddingBottom: 20,
              backgroundColor,
              borderRadius: 8,
              ...globalStyles.shadow,
              shadowOpacity: 0.3,
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
              onPress={hide}
              text="Okay"
              {...{ buttonTextColor, buttonBgColor }}
            />
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Portal>
  );
}

function FlatButton({ text, onPress, buttonTextColor, buttonBgColor }) {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: buttonBgColor,
        borderRadius: 4,
        paddingHorizontal: 14,
        paddingVertical: 8,
        alignSelf: 'flex-end',
        ...globalStyles.shadow,
        shadowOpacity: 0.1,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          color: buttonTextColor,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
