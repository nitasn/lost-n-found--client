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

import { capitalize } from './utils';
import AutoHeightImage from './AutoHeightImage';
import { useFocusEffect } from '@react-navigation/native';

export default function ImagesModal({ navigation, route }) {
  useFocusEffect(() => {
    navigation.setOptions({ title: `${capitalize(postViewed.author.name)}'s Images` });
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
