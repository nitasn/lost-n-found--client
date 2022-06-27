import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { showCustomAlert } from './CustomAlert';
import globalStyles from './globalStyles';
import useDecodedJwt from './useDecodedJwt';
import { prettyDateNoWeekday } from './utils';

export default function MyProfile({ navigation }) {
  const { name, profilePicUrl, iat, _id } = useDecodedJwt();

  useFocusEffect(() => void navigation.setOptions({ title: `Your Profile` }));

  return (
    <>
      <StatusBar style="light" />
      <View
        style={{
          flex: 1,
          //   alignItems: 'center',
          margin: 12,
          padding: 12,
          paddingTop: 18,
          backgroundColor: 'white',
          borderRadius: 12,
          ...globalStyles.shadow,
        }}
      >
        <View style={{ flexDirection: 'row', paddingHorizontal: 8 }}>
          <Text style={{ fontSize: 30 }}>{name}</Text>
          <View style={{ marginLeft: 'auto' }}>
            <FlatButton
              color="darkblue"
              text="Edit"
              iconName="pencil-outline"
              onPress={() => {
                showCustomAlert({
                  header: 'Cannot Edit Yet',
                  body: 'Edit feature is not implemented.',
                });
              }}
            />
          </View>
        </View>

        <View
          style={{
            ...globalStyles.shadow,
            marginVertical: 12,
          }}
        >
          <Image
            style={{
              alignSelf: 'center',
              width: '100%',
              aspectRatio: 1,
              marginHorizontal: 5,
              marginVertical: 12,
              borderRadius: 12,
            }}
            source={{ uri: profilePicUrl }}
          />
          {/* <ImagePickerUploader
            initialUri={profilePicUrl}
            onUploadStateChanged={console.log}
            style={{ width: 327, height: 327 }}
          /> */}
        </View>

        <Text style={{ marginVertical: 12 }}>
          todo: fetch ratings, etc
          {'\n'}
          (using author._id)
        </Text>

        <Text style={{ fontSize: 16, marginVertical: 6 }}>
          Joined at {prettyDateNoWeekday(iat)}
        </Text>
      </View>
    </>
  );
}

function FlatButton({ color, text, iconName, onPress, revert }) {
  const [border, fg] = revert ? [color, 'white'] : [color, color];

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

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
