import * as React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  useWindowDimensions,
  Keyboard,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  Modal,
} from 'react-native';

import globalStyles from './globalStyles';

import { FoundContext } from './contexts';
import { capitalize } from './utils';

import { useFocusEffect } from '@react-navigation/native';

export default function ImagesModal({ navigation }) {
  const { postViewed } = React.useContext(FoundContext);

  useFocusEffect(() => {
    navigation.setOptions({
      title: `${capitalize(postViewed.author.firstName)}'s Images`,
    });
  });

  return (
    <FlatList
      data={postViewed.picsUrls}
      style={{ padding: 6 }}
      renderItem={({ item, index }) => (
        <View
          style={{
            marginBottom: index + 1 == postViewed.picsUrls.length ? 6 : 0,
            ...globalStyles.shadow,
          }}
        >
          <Image style={styles.image} source={{ uri: item }} />
        </View>
      )}
      keyExtractor={(_, idx) => idx}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    borderRadius: 4,
    aspectRatio: 1,
    marginBottom: 6,
  },
});