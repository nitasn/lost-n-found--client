import { Alert as NativeAlert, Platform } from 'react-native';

const defaultButtons = (resolve, reject) => [
  {
    text: 'OK',
    onPress: () => {
      resolve();
    },
  },
];

const AsyncAlert = (title, msg, getButtons = defaultButtons) =>
  new Promise((resolve, reject) => {
    const source = (Platform.OS === 'web' ? window : NativeAlert);
    source.alert(title, msg, getButtons(resolve, reject), { cancelable: false });
  });

export default AsyncAlert;