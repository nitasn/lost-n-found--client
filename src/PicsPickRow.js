import * as React from "react";
import { StyleSheet, ScrollView } from "react-native";
import ImagePickerUploader from "./ImagePickerUploader";
import { newID } from "./utils";

function valueOrDefault(value, fallback) {
  return value != undefined ? value : fallback;
}

/**
 * @returns {{id, uploadState: import("./ImagePickerUploader").UploadState}}
 */
function newEmptyPicState() {
  return {
    // for react's `key` prop
    id: newID(),

    // what we actually care about
    uploadState: {
      status: "no-image",
      url: undefined,
    },
  };
}

/**
 * @typedef {(pics: [import("./ImagePickerUploader").UploadState]) => void} Callback
 * @param {{margins: number?, maxImages: number?, onStateChanged: Callback}}
 */
export default function PicsPickRow({ margins, maxImages, onStateChanged }) {
  margins = valueOrDefault(margins, 9);
  maxImages = valueOrDefault(maxImages, 5);

  const [picksState, setPicksState] = React.useState([newEmptyPicState()]);
  const listRef = React.useRef();

  function onSinglePickStateChanged(idxWhereChagned, newUploadState) {
    const newState = [...picksState];
    newState[idxWhereChagned].uploadState = newUploadState;
    const empties = newState.filter(
      (item) => item.uploadState.status == "no-image"
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
        .filter((item) => item.status != "no-image")
    );
  }

  const styles = StyleSheet.create({
    imagesList: {
      flexDirection: "row",
      borderColor: "black",
      borderWidth: 1,

      flexDirection: "row",
      paddingVertical: margins,
    },
    imagePicker: {
      marginRight: margins,
      width: 150,
      height: 150,
    },
  });

  return (
    <ScrollView style={styles.imagesList} horizontal={true} ref={listRef}>
      {picksState.map(({ id }, idx) => (
        <ImagePickerUploader
          style={[styles.imagePicker, { marginLeft: idx ? 0 : margins }]}
          onUploadStateChanged={(newUploadState) => {
            onSinglePickStateChanged(idx, newUploadState);
          }}
          key={id}
        />
      ))}
    </ScrollView>
  );
}
