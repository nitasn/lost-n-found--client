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
  SafeAreaView,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';

import AsyncAlert from './AsyncAlert';

import CheckBox from './CheckBox';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import PicsPickRow from './PicsPickRow';
import { JwtContext, PostsContext } from './contexts';
import globalStyles from './globalStyles';
import { cache, capitalize, prettyDateNoWeekday } from './utils';
import { LocationContext } from './contexts';
import { server, sendPostReq, deviceName } from './utils';

function LostOrFoundSelector({ type, setType }) {
  return (
    <TouchableOpacity
      onPress={() => setType(type == 'found' ? 'lost' : 'found')}
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: 22,
        ...globalStyles.shadow,
      }}
    >
      <Text
        style={{
          fontSize: 30,
          letterSpacing: 1.3,
          textTransform: 'capitalize',
          marginHorizontal: 10,
          fontWeight: 'bold',
        }}
      >
        I {type}
      </Text>
      <Ionicons size={30} color="black" name="repeat-outline" />
    </TouchableOpacity>
  );
}

function HeaderInput({ header, setHeader, type }) {
  React.useEffect(() => {
    setHeader(header.trimStart());
  }, [header]);

  return (
    <View
      style={{
        borderColor: 'rgba(0,0,0,.4)',

        padding: 12,
        fontSize: 16,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderRadius: 8,
        borderColor: 'black',

        marginTop: 16,
        marginBottom: 24,
      }}
    >
      <TextInput
        autoCapitalize="words"
        value={header}
        onChangeText={setHeader}
        placeholder={`What did you ${type == 'lost' ? 'lose' : 'find'}?`}
        style={{ fontSize: 20 }}
      />
    </View>
  );
}

function ParagraphInput({ paragraph, setParagraph, scrollRef }) {
  React.useEffect(() => {
    setParagraph(paragraph.trimStart());
  }, [paragraph]);

  const fontSize = 16;

  return (
    <View style={{ marginVertical: 24 }}>
      {paragraph == '' && (
        <Text
          style={{
            fontSize,
            color: '#bbb',
            position: 'absolute',
            paddingLeft: 4,
            paddingTop: 4,
          }}
        >
          Add more information (optional)
        </Text>
      )}
      <TextInput
        multiline
        onBlur={() => setParagraph(paragraph.trim())}
        onFocus={() => scrollRef.current.scrollToEnd()}
        scrollEnabled={false}
        onChangeText={setParagraph}
        value={paragraph}
        style={{
          fontSize,
          paddingLeft: 6,
        }}
        maxLength={300}
      ></TextInput>
    </View>
  );
}

function roundToPlaces(number, places) {
  const order = 10 ** places;
  return Math.round(number * order) / order;
}

const reverseGecode = cache(async ({ lat, long }) => {
  lat = roundToPlaces(lat, 6);
  long = roundToPlaces(long, 6);

  try {
    const url =
      `https://api.bigdatacloud.net/data/reverse-geocode-client?` +
      `latitude=${lat}&longitude=${long}&localityLanguage=en`;
    return await fetch(url)
      .then((res) => res.json())
      .then((obj) => obj.city);
  } catch (err) {
    console.error("Couldn't Reverse-Gecode:", err);
    return null;
  }
});

function LocationPicker({ type, location, setLocation }) {
  const deviceLocation = React.useContext(LocationContext);
  const [latLong, setLatLong] = React.useState({
    lat: location.lat,
    long: location.long,
  });
  const [fetchedName, setFetchedName] = React.useState(location.name);
  const [userText, setUserText] = React.useState('');
  const [isHere, setIsHere] = React.useState(true);

  React.useEffect(() => {
    if (deviceLocation) {
      const { latitude, longitude } = deviceLocation;
      setLatLong({ lat: latitude, long: longitude });
    }
  }, [deviceLocation]);

  React.useEffect(() => {
    reverseGecode(latLong).then(setFetchedName);
  }, [latLong]);

  React.useEffect(() => {
    setUserText(userText.trimStart());
  }, [userText]);

  React.useEffect(() => {
    setLocation(
      isHere
        ? {
            ...latLong,
            name: userText || fetchedName,
          }
        : { name: userText }
    );
  }, [isHere, latLong, userText, fetchedName]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: 4,

        marginTop: 4,
        marginBottom: 24,
      }}
    >
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 16 }}>{userText && 'At '}</Text>
        <TextInput
          autoCapitalize="words"
          value={userText}
          onChangeText={setUserText}
          placeholder={
            isHere
              ? fetchedName
                ? `"${fetchedName}"`
                : "Getting this place's Name..."
              : `Where did you ${type == 'lost' ? 'lose' : 'find'} it?`
          }
          style={{
            fontSize: 16,
            // the text "Getting this place's Name..." should be italic
            ...(isHere && !fetchedName && !userText && { fontStyle: 'italic' }),
            ...(userText && { fontWeight: 'bold' }),
            // transform: [{ translateY: .5 }],
          }}
          placeholderTextColor="rgba(0, 0, 0, .4)"
        />
      </View>

      <View style={{ marginLeft: 2 }}>
        <CheckBox isChecked={isHere} onChange={setIsHere} label="Here" />
      </View>
    </View>
  );
}

function SubmitButton({ onPress, isActive }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
      }}
    >
      <TouchableOpacity
        disabled={!isActive}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
          paddingRight: 15,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: isActive ? 'transparent' : 'darkgray',
          backgroundColor: isActive ? 'rgb(26, 119, 169)' : 'transparent',
        }}
        onPress={onPress}
      >
        <Text
          style={{
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: 18,
            color: isActive ? '#eee' : 'darkgray',
          }}
        >
          {isActive ? 'Post →' : 'Post'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default ({ navigation }) => {
  const [type, setType] = React.useState('lost');
  const [header, setHeader] = React.useState('');
  const [paragraph, setParagraph] = React.useState('');
  const [location, setLocation] = React.useState({});
  const [imagesStatuses, setImagesStatus] = React.useState([]);
  const { refreshPosts } = React.useContext(PostsContext);

  useFocusEffect(() => {
    navigation.setOptions({ title: 'Upload Post' });
  });

  const jwt = React.useContext(JwtContext);
  const scrollRef = React.useRef();

  const canPost =
    header.length >= 2 &&
    (location.name || (location.lat && location.long)) &&
    imagesStatuses.every(({ status }) => status == 'succeeded');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={60} // todo try "eact-native-keyboard-aware-scroll-view"
    >
      <ScrollView
        ref={scrollRef}
        style={{
          flex: 1,
          backgroundColor: 'lightgray',
          padding: 14,
          width: '100%',
        }}
      >
        <View
          style={{
            paddingVertical: 25,
            backgroundColor: '#fff',
            borderRadius: 8,
            width: '100%',
            ...globalStyles.shadow,
            shadowOpacity: 0.2,
            marginBottom: 30,
          }}
        >
          <View style={{ paddingHorizontal: 20 }}>
            <LostOrFoundSelector {...{ type, setType }} />
            <HeaderInput {...{ type, header, setHeader }} />
            <LocationPicker {...{ type, location, setLocation }} />
          </View>

          <View style={{ paddingHorizontal: 10 }}>
            <PicsPickRow gap={4} onStateChanged={setImagesStatus} style={{ marginTop: 8 }} />
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            <ParagraphInput {...{ paragraph, setParagraph, scrollRef }} />
            <SubmitButton isActive={canPost} onPress={() => void sendToServer()} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  async function sendToServer() {
    const onError = (msg) =>
      Alert.alert(
        'Not Posted',
        'We seem to face a problem at the moment. \n' +
          'Your post was not posted 💔 \n\n\n' +
          `Error message: "${msg}"`
      );

    const body = {
      type,
      header,
      body: paragraph,
      location,
      picsUrls: imagesStatuses.map(({ url }) => url),
    };

    try {
      const res = await sendPostReq(server`/protected/new-post`, body, jwt);

      const { error, post_id } = await res.json();
      if (error) return onError(error);

      refreshPosts();
      await AsyncAlert('Posted', 'Your post successfully uploaded ❤️');
      navigation.navigate('MorePage');
    } catch (error) {
      onError(error);
    }
  }
};
