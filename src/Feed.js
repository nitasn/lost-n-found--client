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
  FlatList,
  ScrollView,
} from 'react-native';

import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from './globalStyles';
import { FilterContext, PostsContext } from './contexts';
import Post from './Post';
import { useNavigation } from '@react-navigation/native';

export default ({ type, setScrollPosition }) => {
  const { filter } = React.useContext(FilterContext);

  const { allPosts, postsLoadError, refreshPosts } = React.useContext(PostsContext);

  const [posts, setPosts] = React.useState(null);

  React.useEffect(() => {
    if (!allPosts) return;
    const allPostsOfType = allPosts.filter((post) => post.type === type);
    setPosts([replaceMeWithSearchBar, ...apply(filter, allPostsOfType)]);
  }, [allPosts, type, filter]);

  const listRef = React.useRef();

  React.useEffect(() => {
    listRef.current?.scrollToOffset({ animated: true, offset: scrollPosOf.current[type] });
  }, [type]);

  const scrollPosOf = React.useRef({
    lost: 0,
    found: 0,
  });

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  if (postsLoadError) return <PostsLoadErrorScreen msg={postsLoadError} />;

  if (!posts) return <LoadingPostsScreen />;

  return (
    <View style={[styles.conatiner, { flex: 1 }]}>
      <FlatList
        ref={listRef}
        onScroll={(e) => {
          const pos = e.nativeEvent.contentOffset.y;
          setScrollPosition?.(pos);
          scrollPosOf.current[type] = pos;
        }}
        refreshing={isRefreshing}
        onRefresh={() => {
          // todo doesn't work on web
          setIsRefreshing(true); 
          refreshPosts().then(() => setIsRefreshing(false));
        }}
        style={{ paddingHorizontal: 6, paddingVertical: 0, width: '100%' }}
        data={posts}
        renderItem={({ item, index }) => {
          if (item === replaceMeWithSearchBar) {
            return <SearchBar filter={!!filter} />;
          }
          return (
            <View style={index + 1 == posts.length && { marginBottom: 3 }}>
              <Post postData={item} />
            </View>
          );
        }}
        keyExtractor={(obj) => {
          if (obj === replaceMeWithSearchBar) return type + '-search-bar';
          return obj._id;
        }}
      />

      {posts.length == 1 && (
        <View style={{ flex: 3 }}>
          <Text style={{ fontSize: 15, lineHeight: 20, textAlign: 'center' }}>
            {posts.length ? LOOSEN_FILTER_MSG : NO_POSTS_MSG}
          </Text>
        </View>
      )}
    </View>
  );
};

const replaceMeWithSearchBar = Object.freeze({});

function SearchBar({ filter }) {
  const navigation = useNavigation();

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

function LoadingPostsScreen() {
  return (
    <View style={[styles.conatiner, { padding: 12, height: '100%' }]}>
      <Text style={{ margin: 'auto' }}>Loading Posts...</Text>
    </View>
  );
}

function PostsLoadErrorScreen({ msg }) {
  return (
    <View style={[styles.conatiner, { padding: 12, height: '100%' }]}>
      <Text>Could not load posts.</Text>
      <Text>Please make sure you're connected to the internet and try again.</Text>
      <Text>{'\n'}</Text>
      <Text>Error message:</Text>
      <Text>{msg}</Text>
    </View>
  );
}

const LOOSEN_FILTER_MSG = `
Looks like there are no matches...
Loosen your query and try again ❤️`;

const NO_POSTS_MSG = `
No Posts Currently Active ❤️`;

function apply(filter, posts) {
  if (!filter) return posts;

  const conditions = [];

  if (filter.text) {
    conditions.push((post) => {
      const header = post.header.toLowerCase();
      const body = post.body.toLowerCase();
      const queryWords = filter.text.toLowerCase().split(/\s+/g);
      return queryWords.every((qw) => header.includes(qw) || body.includes(qw));
    });
  }

  if (filter.dates?.from) {
    conditions.push((post) => filter.dates.from <= new Date(post.date));
  }

  if (filter.dates?.until) {
    conditions.push((post) => filter.dates.until >= new Date(post.date));
  }

  return posts.filter((post) => conditions.every((check) => check(post)));
}
