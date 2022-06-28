import { FlatList, View } from 'react-native';
import globalStyles from './globalStyles';
import { useFocusEffect } from '@react-navigation/native';
import AutoHeightImage from './AutoHeightImage';
import { capitalize } from './utils';

export default function ImagesModal({ navigation, route }) {
  useFocusEffect(() => {
    navigation.setOptions({ title: capitalize(postViewed.header) });
  });

  const { postViewed } = route.params;

  return (
    <FlatList
      data={postViewed.picsUrls}
      style={{ padding: 8 }}
      renderItem={({ item, index }) => (
        <View
          style={{
            marginBottom: index + 1 == postViewed.picsUrls.length ? 10 : 0,
            ...globalStyles.shadow,
          }}
        >
          <AutoHeightImage uri={item} style={{ borderRadius: 8, marginBottom: 8 }} />
        </View>
      )}
      keyExtractor={(_, idx) => idx}
    />
  );
}
