const DEFAULT_SIZE = 200; // on screen

const RESIZE_TO = 400; // to shrink the selected image into before uploading

import React, { useState, useEffect } from 'react';

import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

import placeholderImgUri from '../assets/add-image-icon.png';
import failureImgUri from '../assets/red-alert.png';
import succcessImgUri from '../assets/success-tick.png';

import bg from '../assets/bg.jpeg';

import globalStyles from './globalStyles';
import uploadToCloudinary from './uploadToCloudinary';
import EverSpinningDots from './EverSpinningDots';

async function askForCameraRollPermissionsWeb() {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Please allow camera roll permissions to add images to your post!');
    }
  }
}

/**
 * @typedef {"no-image"|"in-progress"|"succeeded"|"failed"} UploadStatus
 * @typedef {{status: UploadStatus, url: string?}} UploadState
 */

/**
 * @typedef {Object} Props
 * @property {(state: UploadState) => void} onUploadStateChanged
 * @property {Object?} style
 *
 * @param {Props} props
 */
export default function ImagePickerUploader(props) {
  const [uri, setUri] = useState(null);

  const [uploadState, setUploadState] = useState({
    status: 'no-image',
    url: undefined,
  });

  useEffect(() => props.onUploadStateChanged?.(uploadState), [uploadState]);

  // the callback passed to useEffect needs to be sync,
  // hence we don't simply do useEffect(askForCameraRollPermissionsWeb, [])
  // also "{}" are a must since the return value is a destroy function
  useEffect(() => {
    askForCameraRollPermissionsWeb();
  }, []);

  const placeholderImageStyle = {
    width: (props.style?.width || DEFAULT_SIZE) / 4,
    height: (props.style?.height || DEFAULT_SIZE) / 4,
  };

  const [indcImg, text, color] = (() => {
    switch (uploadState.status) {
      case 'succeeded':
        return [succcessImgUri, 'Ready', 'rgb(68, 217, 46)'];
      case 'failed':
        return [failureImgUri, 'Failed', 'rgb(204, 39, 46)'];
      case 'in-progress':
        return [, 'Uploading...', 'white'];
      case 'no-image':
        return [, , ,];
    }
  })();

  return (
    <TouchableOpacity
      onPress={() => pickImage(setUploadState, setUri)}
      style={[
        styles.container,
        props.style,
        { ...globalStyles.shadow, shadowOpacity: uri ? .25 : .1 },
      ]}
    >
      <Image
        resizeMode="stretch"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: 9,
        }}
        source={bg}
      />

      <Image
        resizeMode="cover"
        style={uri ? styles.mainImage : placeholderImageStyle}
        source={uri ? { uri } : placeholderImgUri}
      />

      {uploadState.status != 'no-image' && (
        <View style={styles.indicatorArea}>
          {uploadState.status != 'in-progress' ? (
            <Image
              resizeMode="contain"
              source={indcImg}
              style={styles.indicatorImage}
            />
          ) : (
            <EverSpinningDots style={styles.indicatorImage} />
            // <Text></Text>
          )}
          <Text style={[styles.indicatorText, { color }]}>{text}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

/**
 * @param {(state: UploadState) => void} setUploadState
 * @param {(uri: string?) => void} setUri
 * @param {number} resizeTo
 */
async function pickImage(setUploadState, setUri) {
  const { uri, cancelled } = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (cancelled || !uri) {
    setUploadState({
      status: 'no-image',
      url: undefined,
    });
    setUri(null);
    return;
  } else {
    setUploadState({
      status: 'in-progress',
      url: undefined,
    });
    setUri(uri);
  }

  async function compressAndUpload() {
    const manipulations = [{ resize: { height: RESIZE_TO, width: RESIZE_TO } }];
    const options = { compress: 1, format: SaveFormat.JPEG, base64: true };

    let { base64 } = await manipulateAsync(uri, manipulations, options);

    await new Promise((res) => setTimeout(res, 2000));
    // throw new Error("testing - network failed demo"); // simulate failure
    // return 'demi-testing-cld-url'; // simulate success

    const cld_url = await uploadToCloudinary(
      'data:image/jpeg;base64,' + base64
    );

    return cld_url;
  }

  compressAndUpload()
    .then((cld_url) =>
      setUploadState({
        status: 'succeeded',
        url: cld_url,
      })
    )
    .catch(() => {
      setUploadState({
        status: 'failed',
        url: undefined,
      });
    });
}

/**
 * todo if picking a file,
 * and while it uploads picking a null file (cancelling the image)
 * the gohst file still uploads in the background, and, worse - we get a "(√) uploaded" mark
 * on the "choose image" placehoder!
 */

// todo since uploadState and uri are
// updated one after the other pretty regularly
// combine them into a single state
// using this custom hook
function useMergeState(initialState) {
  const [state, setState] = useState(initialState);
  const setMergedState = (newState) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };
  return [state, setMergedState];
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 9,
    width: DEFAULT_SIZE,
    height: DEFAULT_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  indicatorArea: {
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    borderRadius: 9,
    height: '20%',
    flexDirection: 'row',
    backgroundColor: 'rgba(127, 127, 127, 0.6)',
    width: '100%',
  },
  indicatorImage: {
    width: '13%',
    aspectRatio: 1,
    alignSelf: 'center',
    marginLeft: 10,
    marginRight: 15,
  },
  indicatorText: {
    textShadowColor: 'rgba(255, 255, 255, 0.65)',
    textShadowRadius: 4,
    fontSize: 16, // todo decrease fontSize if it doesn't fit
    alignSelf: 'center',
  },
});
