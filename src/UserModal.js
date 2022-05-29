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

import { FoundContext } from './contexts';

import { useFocusEffect } from '@react-navigation/native';

import { StatusBar } from 'expo-status-bar';

export default function UserModal({ navigation }) {
  const { author } = React.useContext(FoundContext).postViewed;

  useFocusEffect(() => {
    navigation.setOptions({
      title: `${capitalize(author.firstName)}'s Profile`,
    });
  });

  return (
    <>
      {/* <StatusBar style="light" /> */}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          margin: 12,
          padding: 12,
          backgroundColor: 'white',
          borderRadius: 12,
          ...globalStyles.shadow,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            marginVertical: 12,
            marginHorizontal: 'auto',
          }}
        >
          {author.firstName} {author.lastName}
        </Text>
        <View style={{ ...globalStyles.shadow, marginVertical: 12 }}>
          <Image
            style={{
              width: '100%',
              aspectRatio: 1,
              marginHorizontal: 5,
              borderRadius: Number.MAX_SAFE_INTEGER,
              // borderRadius: 12,
            }}
            source={{ uri: author.profilePicUrl }}
          />
        </View>
        <Text style={{ marginVertical: 24 }}>
          todo: fetch ratings, etc
          {'\n'}
          (using author._id)
        </Text>
      </View>
    </>
  );
}
