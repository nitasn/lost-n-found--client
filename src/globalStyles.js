import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
  fullScreenAndCenter: {
    flex: 1,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,

    elevation: 5,
  },
  noInputOutline:
    Platform.OS === 'web'
      ? {
          outlineStyle: 'none',
        }
      : {},
});
