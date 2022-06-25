import { View, Text } from 'react-native';

export default function () {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        padding: 100,
      }}
    >
      <Text>Sorry... it's a 404 💔</Text>
    </View>
  );
}
