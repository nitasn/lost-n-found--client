import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { showCustomAlert } from './CustomAlert';
import globalStyles from './globalStyles';

export default function MorePage({ navigation }) {
  const menuItems = [
    {
      label: 'Found something? Lost an item?',
      btnText: 'Upload Post',
      iconName: 'add',
      onPress: () => navigation.navigate('PostComposer'),
    },
    {
      label: 'View & edit your profile',
      btnText: 'Profile',
      iconName: 'person-outline',
      onPress: () => navigation.navigate('MyProfile'),
    },
    {
      label: 'View the posts you published',
      btnText: 'My Posts',
      iconName: 'newspaper-outline',
      onPress: () => navigation.navigate('MyPosts'),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#ddd' }}>
      <ScrollView
        style={{
          padding: 16,
          paddingTop: 24,
        }}
      >
        {menuItems.map(({ label, btnText, iconName, onPress }, idx) => {
          return (
            <View key={idx}>
              <Text style={{ lineHeight: 20, paddingHorizontal: 8, fontSize: 15 }}>
                {label}
              </Text>
              <Bar text={btnText} iconName={iconName} onPress={onPress} />
              {idx !== menuItems.length - 1 && <Hr marginVertical={24} />}
            </View>
          );
        })}
      </ScrollView>
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
        style={[
          globalStyles.shadow,
          {
            shadowOpacity: 0.2,

            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 12,
            paddingVertical: 12,
            paddingHorizontal: 24,
            backgroundColor: 'white',
            borderRadius: 12,
            flex: 1,
          },
        ]}
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

const settingsOption = {
  label: 'You know what this means',
  btnText: 'Settings',
  iconName: 'settings-outline',
  onPress: () =>
    showCustomAlert({
      header: 'No Settings Yet',
      body: 'Settings screen is not implemented.',
    }),
};
