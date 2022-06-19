import * as React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Platform,
  useWindowDimensions,
  Keyboard,
  Alert,
  SafeAreaView,
  TextInput,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from './globalStyles';

export default function ({ onName }) {
  const [name, setName] = React.useState('');
  const inputRef = React.useRef();

  React.useEffect(() => void setName(name.trimStart()), [name]);

  React.useEffect(() => {
    AsyncStorage.getItem('name', (err, oldName) => !err && oldName && resolve(oldName));
  }, []);

  async function resolve(value) {
    try {
      await AsyncStorage.setItem('name', value);
    } catch {
      return Alert.alert(
        'Oh snap :(',
        'Your name could not be stored locally on your device. Please make sure to allow storage permissions'
      );
    }
    onName(value);
  }

  const canProceed = name.trim().length >= 2;

  return (
    <SafeAreaView style={[globalStyles.fullScreenAndCenter]}>
      <View
        style={{
          flex: 1,
          width: '100%',
          padding: 12,
        }}
      >
        <ScrollView
          style={{
            backgroundColor: '#fff',
            borderRadius: 8,
            ...globalStyles.shadow,
            shadowOpacity: 0.1,
            flexDirection: 'column',
            padding: 25,
            flex: 1,
            width: '100%',
          }}
        >
          <Text style={{ fontSize: 30, marginTop: 20, textAlign: 'center' }}>
            Lost &amp; Found
          </Text>
          <Text style={{ fontSize: 20, marginTop: 40 }}>Welcome!</Text>
          <Text style={{ fontSize: 20, marginTop: 25 }}>
            The only detail we'll ask you is your name ❤️
          </Text>

          <TouchableOpacity // input
            style={{
              marginTop: 70,
              padding: 12,
              flexDirection: 'row',
              borderWidth: 1.5,
              borderRadius: 4,
              paddingTop: 10,
              borderStyle: 'dashed',
              borderColor: canProceed ? 'darkgray' : 'rgb(26, 119, 169)',
            }}
            onPress={() => inputRef.current.focus()}
          >
            <TextInput
              style={{ fontSize: 20, ...globalStyles.noInputOutline }}
              value={name}
              onChangeText={setName}
              placeholder="name..."
              ref={inputRef}
              maxLength={16}
            />
          </TouchableOpacity>

          <TouchableOpacity // button
            style={{
              marginTop: 22,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: canProceed ? 'rgb(26, 119, 169)' : '#ccc',
              borderRadius: 4,
              paddingHorizontal: 20,
              paddingVertical: 12,
            }}
            disabled={!canProceed}
            onPress={() => void resolve(name)}
          >
            <Text
              style={{
                fontSize: 20,
                marginRight: 12,
                color: 'white',
              }}
            >
              Get In
            </Text>
            <Ionicons size={20} color="white" name="arrow-forward-outline" />
          </TouchableOpacity>

          <Text style={{ fontSize: 20, marginTop: 110, color: 'darkgray' }}>
            You'll be able to add to your personal information later, if you wish.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
