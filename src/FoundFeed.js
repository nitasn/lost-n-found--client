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

import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { sendPostReq, server } from './utils';
import { Ionicons } from '@expo/vector-icons';
import dummyPosts from './dummyPosts.json';
import globalStyles from './globalStyles';
import { FoundContext } from './contexts';
import Post from './Post';

function usePosts() {
  const [posts, setPosts] = React.useState(null);
  const [error, setError] = React.useState(null);

  async function doAsyncWork() {
    try {
      const res = await fetch(server`/public/get-all-posts`);
      const json = await res.json();
      setPosts(json);
    } catch (err) {
      setError(err.message);
      setTimeout(doAsyncWork, 1000);
    }
  }

  React.useEffect(() => void doAsyncWork(), []);

  return [posts, error];
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

function LoadingPostsScreen() {
  return (
    <View style={styles.conatiner}>
      <View>
        <Text>Loading Posts...</Text>
      </View>
    </View>
  );
}

function PostsLoadErrorScreen({ msg }) {
  return (
    <View style={[styles.conatiner, { padding: 12 }]}>
      <View>
        <Text>Could not load posts.</Text>
        <Text>
          Please make sure you're connected to the internet and try again.
        </Text>
        <Text>{'\n'}</Text>
        <Text>Error message:</Text>
        <Text>{msg}</Text>
      </View>
    </View>
  );
}

export default function FoundFeed({ navigation }) {
  // todo pull to refresh

  const { filter } = React.useContext(FoundContext);
  const [allPosts, postsLoadError] = usePosts();

  if (postsLoadError) return <PostsLoadErrorScreen msg={postsLoadError} />;

  if (allPosts == null) return <LoadingPostsScreen />;

  const posts = [replaceMeWithSearchBar, ...apply(filter, allPosts)];

  return (
    <View style={styles.conatiner}>
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

const replaceMeWithSearchBar = Object.freeze({});

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

const styles = StyleSheet.create({
  conatiner: {
    ...globalStyles.fullScreenAndCenter,
    backgroundColor: 'lightgray',
  },
});
