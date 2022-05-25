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
  Image
} from 'react-native';

import { timeDeltaAsString } from './utils';

export default function Post(props) {
  return (
    <View style={styles.container}>
      <View style={styles.LocationAndDate}>
        <Text style={styles.date}>{timeDeltaAsString(props.date)}</Text>
        <Text style={styles.location}>
          {props.location.name}
          {'\n'}
          {props.proximityInKm == undefined
            ? ''
            : props.proximityInKm == 0
            ? '< 0.01 km away'
            : `${props.proximityInKm.toFixed(2)} km away`}
        </Text>
      </View>
      <Text style={styles.header}>{props.header}</Text>
      <Text style={styles.bodyText}>{props.body}</Text>

      <FlatList
        style={styles.imagesContainer}
        data={props.picsUrls}
        horizontal={true}
        renderItem={({ item }) => {
          return <Image style={styles.image} source={{ uri: item }} />;
        }}
        keyExtractor={(_, idx) => idx}
      />

      <View style={styles.lineProfileContainer}>
        <Image
          style={styles.profileImage}
          source={{
            uri: props.author.profilePicUrl,
          }}
        />
        <Text style={styles.pofileName}>
          {props.author.firstName}
        </Text>
        <Text style={{ marginLeft: 'auto', marginRight: 8 }}></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 3,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,

    padding: 8,
    backgroundColor: '#fff',

    marginBottom: 8,
  },
  LocationAndDate: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 12,
  },
  date: {
    // fontFamily: "monoscope",
    fontWeight: 'normal',
    letterSpacing: 1.5,
    fontWeight: 'bold',
    // textTransform: "uppercase",
  },
  location: {
    marginLeft: 'auto',
    // fontFamily: "monoscope", // todo load fonts...
    // fontWeight: "bold",
    letterSpacing: 1.5,
    // textTransform: "uppercase",
    textAlign: 'center',
  },
  header: {
    fontSize: 33,
    marginBottom: 18,
    textTransform: 'capitalize',
    // textAlign: "center",
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 14,
    // textAlign: "center",
  },
  imagesContainer: {
    marginBottom: 14,
  },
  image: {
    width: 200,
    height: 200,
    marginHorizontal: 6,
  },
  lineProfileContainer: {
    display: 'flex',
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
  },
});
