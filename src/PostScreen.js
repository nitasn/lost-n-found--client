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
  Image,
  ScrollView,
  Linking,
  Platform,
  Share,
} from 'react-native';

import { capitalize, server, timeDeltaAsString } from './utils';
import globalStyles from './globalStyles';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { showCustomAlert } from './CustomAlert';

// import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

export default function ({ navigation, route }) {
  useFocusEffect(() => {
    navigation.setOptions({ title: 'View Post' });
  });

  const [postViewed, setPostViewed] = React.useState(route.params.postViewed);
  const [loadError, setLoadError] = React.useState(null);

  React.useEffect(() => {
    if (postViewed) return;
    let isStillMounted = true;
    (async () => {
      const res = await fetch(server`/public/get-post/?_id=${route.params.id}`);
      const json = await res.json();
      if (!isStillMounted) return;
      if (json.error) return setLoadError(json.error);
      setPostViewed(json);
    })();
    return () => (isStillMounted = false);
  }, []);

  if (loadError) {
    return <CenteredText msg="An error occurred... Sorry 💔" />;
  }

  if (!postViewed) {
    return <CenteredText msg="Loading Post..." />;
  }

  const linkToPost = server`/post/${postViewed._id}`;

  return (
    <ScrollView style={{ padding: 6 }}>
      <View style={[styles.container, globalStyles.shadow]}>
        <View style={styles.extraMargin}>
          <View style={styles.LocationAndDate}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.date}>{postViewed.type} </Text>
              <Text style={styles.date}>{timeDeltaAsString(postViewed.date)}</Text>
            </View>
            <View
              style={{
                marginLeft: 'auto',
                alignItems: 'flex-end',
              }}
            >
              <Text
                style={{
                  textTransform: 'capitalize',
                  letterSpacing: 1.5,
                }}
              >
                {postViewed.location.name}
              </Text>
              {postViewed.location.lat && postViewed.location.long && (
                <TouchableOpacity
                  onPress={() =>
                    void Linking.openURL(
                      `https://maps.google.com/?q=${postViewed.location.lat},${postViewed.location.long}`
                    ).catch(({ message }) =>
                      showCustomAlert({
                        header: "Couldn't Open Maps",
                        body: message,
                      })
                    )
                  }
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Text style={{ color: 'steelblue', fontWeight: '600' }}>Map </Text>
                  <Ionicons size={20} name="map-outline" color="steelblue" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <Text style={styles.header}>{postViewed.header}</Text>
          <Text style={styles.bodyText}>{postViewed.body}</Text>
        </View>

        <FlatList
          style={[styles.imagesContainer, { paddingVertical: 8, paddingLeft: 2 }]}
          data={postViewed.picsUrls}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const marginRight = index + 1 == postViewed.picsUrls.length ? 4 : 0;
            return (
              <View style={{ marginRight }}>
                <TouchableOpacity
                  style={{ ...globalStyles.shadow }}
                  onPress={() => navigation.navigate('ImagesModal', { postViewed })}
                >
                  <Image style={styles.image} source={{ uri: item }} />
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={(_, idx) => idx}
        />

        <View>
          <View style={{ width: '100%', paddingHorizontal: 8, marginBottom: 8 }}>
            <View // an hr
              style={{
                height: 1,
                width: '100%',
                backgroundColor: '#ccc',
              }}
            />
          </View>
          <View style={styles.lineProfileContainer}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', margin: 4 }}
              onPress={() => navigation.navigate('UserModal', { postViewed })}
            >
              <Image
                style={styles.profileImage}
                source={{ uri: postViewed.author.profilePicUrl }}
              />
              <Text
                style={{
                  marginLeft: 4,
                  textTransform: 'capitalize',
                  fontWeight: 'bold',
                }}
              >
                {postViewed.author.name}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginLeft: 'auto', marginRight: 8 }}
              onPress={() =>
                showCustomAlert({
                  header: 'Chat Coming Soon...',
                  body: 'Currenty under development ❤️',
                })
              }
            >
              <Text
                style={{
                  borderWidth: 1,
                  borderStyle: 'solid',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 4,
                }}
              >
                Contact
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 8,
          paddingHorizontal: 12,
          marginTop: 4,
          marginBottom: 20,
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            const body = [
              `I'd like to report this.`,
              ``,
              `Link to Post:`,
              linkToPost,
            ].join('\n');

            const subject = 'Report Post';

            Linking.openURL(
              encodeURI(
                `mailto:lost.n.found.nitsan@gmail.com?&subject=${subject}&body=${body}`
              )
            ).catch(({ message }) =>
              showCustomAlert({
                header: "Couldn't Launch Email App",
                body: message,
              })
            );
          }}
        >
          <Text style={{ textDecorationLine: 'underline' }}>Report Post</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            async function attemptShare() {
              await Share.share({
                message: `Thought you might find this ${postViewed.type} item interesting:\n${linkToPost}`,
              });
            }

            async function fallback() {
              await Clipboard.setStringAsync(linkToPost);
              showCustomAlert({
                header: 'copied',
                body: 'Link to Post was Copied to Clipboard',
              });
            }

            attemptShare().catch(fallback);
          }}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={{ color: 'steelblue', fontWeight: 'bold' }}>Share </Text>
          <View style={{ position: 'relative', transform: [{ translateY: -1 }] }}>
            <Ionicons size={20} name="share-outline" color="steelblue" />
            <Ionicons
              size={19}
              name="share-outline"
              color="steelblue"
              style={{
                position: 'absolute',
                // transform: [{ translateX: 1 }, { translateY: 1 }],
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function CenteredText({ msg }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}
    >
      <Text>{msg}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  extraMargin: {
    margin: 8,
  },

  container: {
    margin: 3,

    padding: 10,
    backgroundColor: '#fff',

    marginBottom: 8,
    borderRadius: 8,
  },
  LocationAndDate: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 12,
  },
  date: {
    letterSpacing: 1.2,
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 33,
    marginBottom: 18,
    textTransform: 'capitalize',
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 14,
  },
  imagesContainer: {
    marginBottom: 14,
  },
  image: {
    width: 200,
    height: 200,
    marginHorizontal: 5,
    borderRadius: 4,
  },
  lineProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  profileImage: {
    margin: 6,

    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    overflow: 'hidden',
  },
});
