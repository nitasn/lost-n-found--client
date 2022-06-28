import * as React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LocationContext } from './contexts';
import globalStyles from './globalStyles';
import { geoDistance, timeDeltaAsString } from './utils';

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
  const navigation = useNavigation();

  return (
    <View style={[styles.container, globalStyles.shadow]}>
      <View style={styles.extraMargin}>
        <View style={styles.LocationAndDate}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.date}>{postData.type} </Text>
            <Text style={styles.date}>{timeDeltaAsString(postData.date)}</Text>
          </View>
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
            <TouchableOpacity
              style={{ marginRight, ...globalStyles.shadow }}
              onPress={() => navigation.navigate('ImagesModal', { postViewed: postData })}
            >
              <Image style={styles.image} source={{ uri: item }} />
            </TouchableOpacity>
          );
        }}
        keyExtractor={(_, idx) => idx}
      ></FlatList>
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

        <TouchableOpacity
          style={{ padding: 12, width: '100%' }}
          onPress={() => navigation.navigate('PostScreen', { postViewed: postData })}
        >
          <Text style={{ fontStyle: 'italic', fontWeight: '600', letterSpacing: 1.2 }}>
            View Post &gt;
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    return 'near you';
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
    fontSize: 29,
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
  profileImage: {
    margin: 6,

    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    overflow: 'hidden',
  },
});

/**
 * todo
 * click on image here to open large
 * also clear button for show more in the post (2 post screen)
 */
