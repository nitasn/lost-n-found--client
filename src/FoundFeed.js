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
} from 'react-native';

import globalStyles from './globalStyles';
import ImagePickerUploader from './ImagePickerUploader';

import PicsPickRow from './PicsPickRow';

import dummyPosts from './dummyPosts.json';
import Post from './Post';

export default function FoundFeed({ navigation }) {
  return (
    <View style={globalStyles.fullScreenAndCenter}>
      <Text style={{ marginBottom: 12 }}>Found Screen will be here</Text>

      {/* <View style={[styles.widthLimitingContainer, { marginVertical: 6 }]}>
        <PicsPickRow margins={7} maxImages={5} onStateChanged={console.log} />
      </View> */}

      <Post {...dummyPosts[0]}/>
    </View>
  );
}

const styles = StyleSheet.create({
  widthLimitingContainer: {
    width: '90%',
    maxWidth: 400,
  },
});
