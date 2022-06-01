import * as React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import globalStyles from './globalStyles';
import ImagePickerUploader from './ImagePickerUploader';
import { newID } from './utils';

function valueOrDefault(value, fallback) {
  return value != undefined ? value : fallback;
}

function newEmptyPicState() {
  return {
    // for react's `key` prop
    id: newID(),

    // what we actually care about
    uploadState: {
      status: 'no-image',
      url: undefined,
    },
  };
}

export default function PicsPickRow({ gap, maxImages, onStateChanged, style }) {
  maxImages = valueOrDefault(maxImages, 5);

  const [picksState, setPicksState] = React.useState([newEmptyPicState()]);
  const listRef = React.useRef();

  function onSinglePickStateChanged(idxWhereChagned, newUploadState) {
    const newState = [...picksState];
    newState[idxWhereChagned].uploadState = newUploadState;
    const empties = newState.filter(
      (item) => item.uploadState.status == 'no-image'
    );
    for (let i = 1; i < empties.length; i++) {
      const idx = newState.indexOf(empties[i]);
      newState.splice(idx, 1);
    }
    if (empties.length == 0 && newState.length < maxImages) {
      newState.push(newEmptyPicState());
      setTimeout(() => listRef.current.scrollToEnd(), 500);
    }
    setPicksState(newState);
    onStateChanged?.(
      newState
        .map(({ uploadState }) => uploadState)
        .filter((item) => item.status != 'no-image')
    );
  }

  const styles = StyleSheet.create({
    container: {
      padding: 4, // todo stretch side-ways and keep shadow uncut... 
      paddingBottom: 12,
      borderColor: 'black',
      // borderWidth: 1,
      borderRadius: 8,
      overflow: 'hidden',
      ...style,
    },
    imagesList: {
      flexDirection: 'row',
      overflow: 'visible'
    },
    imagePicker: {
      width: 180,
      height: 180,
      
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.imagesList}
        horizontal={true}
        ref={listRef}
        showsHorizontalScrollIndicator={false}
      >
        {picksState.map(({ id }, idx) => (
          <ImagePickerUploader
            style={[
              styles.imagePicker,
              idx + 1 < picksState.length && { marginRight: gap },
            ]}
            onUploadStateChanged={(newUploadState) => {
              onSinglePickStateChanged(idx, newUploadState);
            }}
            key={id}
          />
        ))}
      </ScrollView>
    </View>
  );
}
