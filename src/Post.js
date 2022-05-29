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
} from 'react-native';

import { timeDeltaAsString } from './utils';

import globalStyles from './globalStyles';

import { FoundContext } from './contexts';

export default function Post(props) {
  const { setPostViewed } = React.useContext(FoundContext);
  // todo can i use useNavigation?

  return (
    <View style={[styles.container, globalStyles.shadow]}>
      <View style={styles.extraMargin}>
        <View style={styles.LocationAndDate}>
          <Text style={styles.date}>{timeDeltaAsString(props.date)}</Text>
          <Text style={styles.location}>
            {props.location.name}
            {'\n'}
            {props.proximityInKm != undefined &&
              prettyDistance(props.proximityInKm)}
          </Text>
        </View>
        <Text style={styles.header}>{props.header}</Text>
        <Text style={styles.bodyText}>{props.body}</Text>
      </View>

      <FlatList
        style={[
          styles.imagesContainer,
          { paddingBottom: 8 },
          // { borderWidth: 1, borderStyle: 'solid', borderColor: 'darkgray' },
          { borderRadius: 4 },
          { paddingLeft: 2 },
          { paddingTop: 8 },
          // { backgroundColor: '#eee'}
        ]}
        data={props.picsUrls}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const marginRight = index + 1 == props.picsUrls.length ? 4 : 0;
          return (
            <View style={[{ marginRight }, globalStyles.shadow]}>
              <TouchableOpacity
                onPress={() => {
                  setPostViewed(props);
                  props.navigation.navigate('ImagesModal');
                }}
              >
                <Image style={styles.image} source={{ uri: item }} />
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(_, idx) => idx}
      />

      <TouchableOpacity
        onPress={() => {
          setPostViewed(props);
          props.navigation.navigate('UserModal');
        }}
      >
        <View style={styles.lineProfileContainer}>
          <Image
            style={styles.profileImage}
            source={{ uri: props.author.profilePicUrl }}
          />
          <Text style={styles.pofileName}>
            {props.author.firstName} {props.author.lastName}
          </Text>
        </View>
      </TouchableOpacity>
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
    textAlign: 'center',
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
  pofileName: {
    margin: 6,
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
});
