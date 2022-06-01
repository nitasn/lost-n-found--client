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
  TextInput,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import globalStyles from './globalStyles';
import { useFocusEffect } from '@react-navigation/native';
import dummyPosts from './dummyPosts.json';
import Post from './FoundPost';
import { FoundContext } from './contexts';

const filterShape = {
  text: String,
  dates: {
    from: Date,
    until: Date,
  },
  location: {
    latLong: [Number, Number],
    radiusKm: Number,
  },
};

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { prettyDate } from './utils';

function DatePicker({ word, onChange, date }) {
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <>
      <TouchableOpacity
        style={{ flexDirection: 'row', ...styles.boxed }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ marginRight: 8 }}>{word}</Text>
        <Text style={{ fontWeight: 'bold' }}>
          {date ? prettyDate(date) : 'Any Date'}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={modalVisible}
        textColor="black"
        mode="date"
        onConfirm={(date) => (setModalVisible(false), onChange(date))}
        onCancel={() => setModalVisible(false)}
      />
    </>
  );
}

export default function FilterPicker({ navigation }) {
  const { filter, setFilter } = React.useContext(FoundContext);

  const [text, setText] = React.useState(filter?.text);
  const [fromDate, setFromDate] = React.useState(filter?.dates?.from);
  const [untilDate, setUntilDate] = React.useState(filter?.dates?.until);

  React.useEffect(() => {
    if (!text && !fromDate && !untilDate) {
      return setFilter(null);
    }
    setFilter({
      text,
      dates: {
        from: fromDate,
        until: untilDate,
      },
    });
  }, [text, fromDate, untilDate]);

  useFocusEffect(() => {
    navigation.setOptions({
      title: 'Search',
    });
  });

  return (
    <View style={{ margin: 12, padding: 12 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            marginHorizontal: 4,
            fontSize: 20,
            marginTop: 8,
            marginBottom: 18,
          }}
        >
          {filter ? (
            <>
              Search is <Text style={{ fontWeight: 'bold' }}>On </Text>
              <View style={{ transform: [{ translateY: 2 }] }}>
                <Ionicons size={20} color="black" name="search" />
              </View>
            </>
          ) : (
            <Text>What to search by?</Text>
          )}
        </Text>
      </View>

      <TextInput
        style={{ ...styles.boxed, fontWeight: text ? '500' : 'normal' }}
        onChangeText={setText}
        value={text}
        placeholder="Words..."
        placeholderTextColor="gray"
      />

      <DatePicker word="Since" date={fromDate} onChange={setFromDate} />
      <DatePicker word="Until" date={untilDate} onChange={setUntilDate} />

      <View
        style={{
          width: '100%',
          height: 1,
          backgroundColor: 'gray',
          borderRadius: 0.5,
          marginTop: 24,
        }}
      />

      {filter && (
        <View
          style={{
            marginTop: 24,
            marginBottom: 18,

            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            width: '100%',
            paddingHorizontal: 12,
          }}
        >
          <FlatButton
            color="rgb(26, 119, 169)"
            text="Show Results"
            iconName="arrow-forward-outline"
            revert
            onPress={() => navigation.navigate('FoundFeed')}
          />

          <FlatButton
            color="maroon"
            text="Clear Filter"
            iconName="close-circle-outline"
            onPress={() => {
              setText('');
              setFromDate(null);
              setUntilDate(null);
            }}
          />
        </View>
      )}
    </View>
  );
}

function FlatButton({ color, text, iconName, onPress, revert }) {
  const [bg, border, fg] = revert
    ? [color, color, 'white']
    : ['#e7e7e7', color, color];

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        backgroundColor: bg,
        borderColor: border,
        borderStyle: 'solid',
        borderRadius: 4,
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 6,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          fontSize: 16,
          marginRight: 7,
          color: fg,
        }}
      >
        {text}
      </Text>

      <Ionicons size={20} color={fg} name={iconName} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boxed: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
  },
});
