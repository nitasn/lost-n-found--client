import * as React from 'react';
import globalStyles from './globalStyles';
import { View, Text, FlatList } from 'react-native';
import useDecodedJwt from './useDecodedJwt';
import { server } from './utils';
import Post from './Post';

export default function () {
  const myJwt = useDecodedJwt();
  
  React.useEffect(fetchPosts, [myJwt]);

  const [posts, setPosts] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  function fetchPosts() {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        if (!myJwt?._id) throw new Error("Couldn't find your user id 🤔");
        const res = await fetch(server`/public/get-all-posts/?authorId=${myJwt._id}`);
        const json = await res.json();
        mounted && setPosts(json);
      } 
      catch (err) {
        mounted && setError(err);
      } 
      finally {
        mounted && setLoading(false);
      }
    })();
    return () => (mounted = false);
  }

  if (!posts && loading) return <CenteredText msg="Loading your posts..." />;
  if (error) return <CenteredText msg={`Encounter an error: \n${error.message}`} />;

  return (
    <View style={{ backgroundColor: '#ddd', paddingVertical: 0 }}>
      <FlatList
        refreshing={loading}
        onRefresh={fetchPosts}
        style={{ paddingHorizontal: 8 }}
        data={posts}
        renderItem={({ item, index }) => (
          <View
            style={[
              index === 0 && { marginTop: 8 },
              isLast(posts, index) && { marginBottom: 4 },
            ]}
          >
            <Post postData={item} />
          </View>
        )}
        keyExtractor={({ _id }) => _id}
      />
    </View>
  );
}

function CenteredText({ msg }) {
  return (
    <View style={globalStyles.fullScreenAndCenter}>
      <Text style={{ maxWidth: 350, fontSize: 15 }}>{msg}</Text>
    </View>
  );
}

function isLast(list, index) {
  return list.length - 1 === index;
}
