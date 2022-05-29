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
} from 'react-native';

import globalStyles from './globalStyles';

import dummyPosts from './dummyPosts.json';
import Post from './Post';

import { FoundContext } from './contexts';
import { capitalize } from './utils';

import { Ionicons } from '@expo/vector-icons';

function usePosts(filter) {
  // todo fetch from server in a useEffect or every minute
  return dummyPosts;
}

function apply(filter, posts) {
  if (!filter) return posts;

  const conditions = [];

  if (filter.text) {
    conditions.push((post) => {
      const text = post.header.toLowerCase() + ' ' + post.body.toLowerCase();
      const queryWords = filter.text.toLowerCase().split(/\s+/g);
      return queryWords.every((qw) => text.includes(qw));
    });
  }

  if (filter.dates?.from) {
    conditions.push((post) => {
      return filter.dates.from - new Date(post.date) <= 0;
    });
  }

  if (filter.dates?.until) {
    conditions.push((post) => {
      return filter.dates.until - new Date(post.date) >= 0;
    });
  }

  return posts.filter((post) => conditions.every((check) => check(post)));
}

import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';

export default function FoundFeed({ navigation }) {
  const { filter } = React.useContext(FoundContext);
  const allPosts = usePosts();

  const posts = React.useMemo(
    () => [replaceMeWithSearchBar, ...apply(filter, allPosts)],
    [filter, allPosts]
  );

  return (
    <View
      style={{
        ...globalStyles.fullScreenAndCenter,
        //  { backgroundColor: '#fce3e1' }
        backgroundColor: 'lightgray',
      }}
    >
      <FlatList
        style={{ padding: 6, paddingTop: 0, width: '100%' }}
        data={posts}
        renderItem={({ item, index }) => {
          if (item == replaceMeWithSearchBar) {
            return <SearchBar navigation={navigation} />;
          }
          return (
            <View style={{ marginBottom: index + 1 == posts.length && 3 }}>
              <Post {...item} navigation={navigation} />
            </View>
          );
        }}
        keyExtractor={(_, idx) => idx}
      />
      {posts.length == 1 && (
        <View style={{ marginBottom: vh(50) }}>
          <Text style={{ fontSize: 15, lineHeight: 20 }}>
            Looks like there are no matches...
            {'\n'}
            Loosen your query and try again ❤️
          </Text>
        </View>
      )}
    </View>
  );
}

const replaceMeWithSearchBar = Object.create(null);

function SearchBar({ navigation }) {
  const { filter } = React.useContext(FoundContext);

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 3,
        marginVertical: 12,
        paddingVertical: 12,
        paddingHorizontal: 26,
        backgroundColor: 'white',
        borderRadius: 12,
        ...globalStyles.shadow,
        shadowOpacity: 0.2,
      }}
      onPress={() => {
        navigation.navigate('FilterPicker');
      }}
    >
      <Text
        style={{
          fontWeight: filter ? 'bold' : 'normal',
          fontSize: 15,
          letterSpacing: 1.1,
        }}
      >
        {filter ? 'Tap to View Filter' : 'Search...'}
      </Text>
      <Ionicons size={20} color="black" name="search" />
    </TouchableOpacity>
  );
}
