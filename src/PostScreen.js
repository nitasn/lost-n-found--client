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
} from 'react-native';

import geoDistance, { capitalize, timeDeltaAsString } from './utils';
import globalStyles from './globalStyles';
import { FeedContext, LocationContext } from './contexts';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MapView from 'react-native-maps';

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

export default function () {
  const { postViewed } = React.useContext(FeedContext);
  const proximityInKm = useDistanceInKm(postViewed.location);
  const navigation = useNavigation();

  useFocusEffect(() => {
    navigation.setOptions({ title: `${capitalize(postViewed.author.name)}'s Post` });
  });

  return (
    <ScrollView>
      <View style={[styles.container, globalStyles.shadow]}>
        <View style={styles.extraMargin}>
          <View style={styles.LocationAndDate}>
            <Text style={styles.date}>{timeDeltaAsString(postViewed.date)}</Text>
            <Text style={styles.location}>
              <Text style={{ textTransform: 'capitalize' }}>
                {postViewed.location.name}
              </Text>
              <Text>
                {'\n'}
                {proximityInKm != undefined && prettyDistance(proximityInKm)}
              </Text>
            </Text>
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
                <TouchableOpacity style={{ ...globalStyles.shadow }}>
                  <Image style={styles.image} source={{ uri: item }} />
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={(_, idx) => idx}
        />
        <View
          style={{
            width: '100%',
            height: 300,
            ...globalStyles.shadow,
            padding: 6,
          }}
        >
          <MapView
            style={{ flex: 1, borderRadius: 6 }}
            region={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </View>
        <View>
          <View style={{ width: '100%', paddingHorizontal: 8, marginVertical: 8 }}>
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
    </ScrollView>
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
    margin: 8,

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
