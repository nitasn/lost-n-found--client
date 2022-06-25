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
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import globalStyles from './globalStyles';
import CustomAlert from './CustomAlert';

export default function MorePage({ navigation }) {
  const [isAlertShown, setIsAlertShown] = React.useState(false);

  return (
    <View
      style={{
        ...globalStyles.fullScreenAndCenter,
        alignItems: 'flex-start',
        padding: 16,
      }}
    >
      <Text style={{ lineHeight: 20, paddingHorizontal: 8 }}>
        Found something? Lost an item?
      </Text>
      <Bar
        text="Upload Post"
        iconName="add"
        onPress={() => navigation.navigate('PostComposer')}
      />

      <Hr marginVertical={24} />

      <Text style={{ lineHeight: 20, paddingHorizontal: 8 }}>
        Manage &amp; view history
      </Text>
      <Bar
        text="Profile"
        iconName="person-outline"
        onPress={() => navigation.navigate('MyProfile')}
      />

      <Hr marginVertical={24} />

      <Text style={{ lineHeight: 20, paddingHorizontal: 8 }}>
        You know what this means
      </Text>
      <Bar
        text="Settings"
        iconName="settings-outline"
        onPress={() => setIsAlertShown(true)}
      />

      <CustomAlert
        isShown={isAlertShown}
        onClose={() => setIsAlertShown(false)}
        header="hello there"
        body="what would you like to do next?"
      />
    </View>
  );
}

function Hr({ marginVertical }) {
  return (
    <View
      style={{
        width: '100%',
        height: 1,
        backgroundColor: 'gray',
        borderRadius: 0.5,
        marginVertical,
      }}
    />
  );
}

function Bar({ onPress, text, iconName }) {
  return (
    <View style={{ flexDirection: 'row', width: '100%' }}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 12,
          paddingVertical: 12,
          paddingHorizontal: 24,
          backgroundColor: 'white',
          borderRadius: 12,
          ...globalStyles.shadow,
          shadowOpacity: 0.2,
          flex: 1,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            letterSpacing: 1.1,
          }}
        >
          {text}
        </Text>
        <Ionicons size={20} color="black" name={iconName} />
      </TouchableOpacity>
    </View>
  );
}
