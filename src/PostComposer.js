import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CheckBox from './CheckBox';
import { JwtContext, LocationContext, PostsContext } from './contexts';
import { showCustomAlert } from './CustomAlert';
import globalStyles from './globalStyles';
import PicsPickRow from './PicsPickRow';
import { cache, sendPostReq, server } from './utils';

export default () => {
  const [count, setCount] = React.useState(0);

  return <PostForm key={count} rerender={() => setCount(count + 1)} />;
};

function PostForm({ rerender }) {
  const navigation = useNavigation();
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

  const [isPosting, setIsPosting] = React.useState(false);

  const canPost =
    header.length >= 2 &&
    (location.name || (location.lat && location.long)) &&
    imagesStatuses.every(({ status }) => status == 'succeeded') &&
    imagesStatuses.length >= 1 &&
    !isPosting;

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
            <PicsPickRow
              gap={4}
              onStateChanged={setImagesStatus}
              style={{ marginTop: 8 }}
            />
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            <ParagraphInput {...{ paragraph, setParagraph, scrollRef }} />
            <SubmitButton
              isPosting={isPosting}
              isActive={canPost}
              onPress={() => void sendToServer()}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  async function sendToServer() {
    const onError = (msg) => {
      showCustomAlert({
        header: 'Not Posted',
        body:
          'We seem to face a problem at the moment. \n' +
          'Your post was not posted ???? \n\n\n' +
          `Error message: "${msg}"`,
      });
    };

    const body = {
      type,
      header,
      body: paragraph,
      location,
      picsUrls: imagesStatuses.map(({ url }) => url),
    };

    try {
      setIsPosting(true);
      const res = await sendPostReq(server`/protected/new-post`, body, jwt);

      const { error, post_id } = await res.json();

      if (error) return onError(error);

      console.log('posted! post id:', post_id);

      showCustomAlert({
        header: 'Posted',
        body: 'Your post successfully uploaded ??????',
        onClose: () => {
          rerender();
          navigation.navigate('PostScreen', { id: post_id });
        },
      });

      refreshPosts();
    } catch (err) {
      console.error('could not post because:', err.message, err);
      onError(err.message);
    } finally {
      setIsPosting(false);
    }
  }
}

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
        style={[{ fontSize: 20 }, globalStyles.noInputOutline]}
      />
    </View>
  );
}

function ParagraphInput({ paragraph, setParagraph, scrollRef }) {
  React.useEffect(() => {
    setParagraph(paragraph.trimStart());
  }, [paragraph]);

  const [height, setHeight] = React.useState(20);

  return (
    <View style={{ marginVertical: 24 }}>
      <TextInput
        multiline
        placeholder="Add more information (optional)"
        onBlur={() => setParagraph(paragraph.trim())}
        onFocus={() => scrollRef.current.scrollToEnd()}
        scrollEnabled={false}
        onChangeText={setParagraph}
        value={paragraph}
        onContentSizeChange={(event) => {
          setHeight(event.nativeEvent.contentSize.height);
        }}
        style={[
          {
            fontSize: 16,
            paddingLeft: 6,
            height,
            paddingTop: 0, // it's a default setting (?) and we need to override it
          },
          globalStyles.noInputOutline,
        ]}
        maxLength={300}
      />
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
    latLong.lat && reverseGecode(latLong).then(setFetchedName);
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 4,

        marginTop: 4,
        marginBottom: 24,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 16 }}>{userText && `I ${type} it at `}</Text>
        <TextInput
          autoCapitalize="words"
          value={userText}
          onChangeText={setUserText}
          placeholder={
            isHere
              ? fetchedName
                ? `I ${type} it at "${fetchedName}"`
                : "Getting this place's Name..."
              : `Where did you ${type == 'lost' ? 'lose' : 'find'} it?`
          }
          style={[
            { fontSize: 16 },

            // the text "Getting this place's Name..." should be italic
            isHere && !fetchedName && !userText && { fontStyle: 'italic' },

            userText && { fontWeight: 'bold' },

            globalStyles.noInputOutline,
          ]}
          placeholderTextColor="rgba(0, 0, 0, .4)"
        />
      </View>

      <View style={{ marginLeft: 2 }}>
        <CheckBox isChecked={isHere} onChange={setIsHere} label="Here" />
      </View>
    </View>
  );
}

function SubmitButton({ onPress, isActive, isPosting }) {
  if (isPosting) isActive = false; // it's gonna be false anyway, but to be 102% sure

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
          {isPosting ? 'Posting...' : isActive ? 'Post ???' : 'Post'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
