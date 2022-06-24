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
  ScrollView,
  Linking,
  Platform,
  Share,
} from 'react-native';

import geoDistance, { capitalize, server, timeDeltaAsString } from './utils';
import globalStyles from './globalStyles';
import { FeedContext, LocationContext } from './contexts';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

export default function () {
  const { postViewed } = React.useContext(FeedContext);
  const navigation = useNavigation();

  useFocusEffect(() => {
    navigation.setOptions({ title: `${capitalize(postViewed.author.name)}'s Post` });
  });

  const linkToPost = server`/view-post/?_id=${postViewed._id}`;

  return (
    <ScrollView style={{ padding: 6 }}>
      <View style={[styles.container, globalStyles.shadow]}>
        <View style={styles.extraMargin}>
          <View style={styles.LocationAndDate}>
            <Text style={styles.date}>{timeDeltaAsString(postViewed.date)}</Text>
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
                    ).catch((err) => Alert.alert("Couldn't load page: " + err.message))
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
                  onPress={() => navigation.navigate('ImagesModal')}
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
            <TouchableOpacity style={{ marginLeft: 'auto', marginRight: 8 }}>
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
            ).catch((err) => Alert.alert("Couldn't load page: " + err.message));
          }}
        >
          <Text style={{ textDecorationLine: 'underline' }}>Report Post</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            const alert = Platform.OS == 'web' ? window.alert : Alert.alert;

            async function attemptShare() {
              await Share.share({
                message: `Thought you might find this ${postViewed.type} item interesting:\n${linkToPost}`,
              });
            }

            async function fallback1() {
              await Clipboard.setStringAsync('hello world');
              alert('Link to Post was Copied to Clipboard');
            }

            async function fallback2() {
              await navigator.clipboard.writeText(linkToPost);
              alert('Link to Post was Copied to Clipboard');
              console.log('gosh we are in the second share fallback');
            }

            attemptShare().catch(fallback1).catch(fallback2);
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
    fontWeight: 'normal',
    letterSpacing: 1.2,
    fontWeight: 'bold',
    textTransform: 'capitalize',
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
