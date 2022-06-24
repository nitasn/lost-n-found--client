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
  TouchableWithoutFeedback
} from 'react-native';

import geoDistance, { capitalize, timeDeltaAsString } from './utils';
import globalStyles from './globalStyles';
import { FeedContext, LocationContext } from './contexts';
import { useNavigation } from '@react-navigation/native';

function useDistanceInKm(postLocation) {
  const deviceLocation = React.useContext(LocationContext);
  const [distance, setDistance] = React.useState(undefined);

  React.useEffect(() => {
    const { lat, long } = postLocation;
    if (lat && long && deviceLocation) {
      const { latitude, longitude } = deviceLocation;
      const dist = geoDistance(latitude, longitude, lat, long);
      setDistance(dist);
    }
  }, [deviceLocation]);

  return distance;
}

export default function ({ postData }) {
  const proximityInKm = useDistanceInKm(postData.location);
  const { setPostViewed } = React.useContext(FeedContext);
  const navigation = useNavigation();

  const onAuthorClick = () => {
    setPostViewed(postData);
    navigation.navigate('UserModal');
  };

  const onChatClick = () => {
    setPostViewed(postData);
    Alert.alert('Chat is currenty under development <3');
  };

  const onPostClick = () => {
    setPostViewed(postData);
    navigation.navigate('PostScreen');
  }

  return (
    <TouchableOpacity style={[styles.container, globalStyles.shadow]} onPress={onPostClick}>
      <View style={styles.extraMargin}>
        <View style={styles.LocationAndDate}>
          <Text style={styles.date}>{timeDeltaAsString(postData.date)}</Text>
          <Text style={styles.location}>
            <Text style={{ textTransform: 'capitalize' }}>{postData.location.name}</Text>
            <Text>
              {'\n'}
              {proximityInKm != undefined && prettyDistance(proximityInKm)}
            </Text>
          </Text>
        </View>
        <Text style={styles.header}>{postData.header}</Text>
        <Text style={styles.bodyText}>{postData.body}</Text>
      </View>

      <FlatList
        style={[styles.imagesContainer, { paddingVertical: 8, paddingLeft: 2 }]}
        data={postData.picsUrls}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const marginRight = index + 1 == postData.picsUrls.length ? 4 : 0;
          return (
            <View style={{ marginRight, ...globalStyles.shadow }}>
              <TouchableWithoutFeedback>
                {/* to allow scrolling wihtout tapping the post */}
                <Image style={styles.image} source={{ uri: item }} />
              </TouchableWithoutFeedback>
            </View>
          );
        }}
        keyExtractor={(_, idx) => idx}
      >
        <View
          style={{
            position: 'absolute',
            height: 70,
            width: 70,
            right: 70,
            borderRadius: Number.MAX_SAFE_INTEGER,
            backgroundColor: 'rgba(0, 0, 0, .9)',
          }}
        />
      </FlatList>

      <View>
        <View // an hr
          style={{
            position: 'absolute',
            height: 1,
            width: '94%',
            left: '3%',
            backgroundColor: '#ccc',
            paddingHorizontal: 158,
            transform: [{ translateY: -5 }],
          }}
        />

        <View style={styles.lineProfileContainer}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', margin: 4 }}
            onPress={onAuthorClick}
          >
            <Image
              style={styles.profileImage}
              source={{ uri: postData.author.profilePicUrl }}
            />
            <Text
              style={{
                marginLeft: 4,
                textTransform: 'capitalize',
                fontWeight: 'bold',
              }}
            >
              {postData.author.name}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginLeft: 'auto', marginRight: 8 }}
            onPress={onChatClick}
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
    </TouchableOpacity>
  );
}

function prettyDistance(proximityInKm) {
  if (proximityInKm >= 10) {
    return `${proximityInKm.toFixed(0)} km away`;
  }
  if (proximityInKm >= 1) {
    return `${proximityInKm.toFixed(1)} km away`;
  }
  if (proximityInKm <= 0.1) {
    return 'at this area';
  }
  return `${proximityInKm.toFixed(2)} km away`;
}

const styles = StyleSheet.create({
  extraMargin: {
    margin: 8,
  },

  container: {
    margin: 3,

    padding: 8,
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
  location: {
    marginLeft: 'auto',
    letterSpacing: 1.5,
    textAlign: 'right',
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
    aspectRatio: 1,
    resizeMode: 'cover',
    borderRadius: 4,
    marginHorizontal: 5,
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
