import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { showCustomAlert } from './CustomAlert';
import globalStyles from './globalStyles';
import useDecodedJwt from './useDecodedJwt';
import { prettyDateNoWeekday } from './utils';

export default function MyProfile({ navigation }) {
  const { name, profilePicUrl, iat, _id } = useDecodedJwt();

  useFocusEffect(() => void navigation.setOptions({ title: `Your Profile` }));

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          margin: 12,
          padding: 14,
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
              color="steelblue"
              text="Edit"
              iconName="pencil-outline"
              onPress={() => {
                showCustomAlert({
                  header: 'Cannot Edit Yet',
                  body: 'Edit feature is yet to be implemented.',
                });
              }}
            />
          </View>
        </View>
        <View style={[{ marginTop: 12 }, globalStyles.shadow]}>
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
        </View>
        <View style={{ marginVertical: 20 }}>
          <Text style={{ fontSize: 16, fontStyle: 'italic' }}>
            reviews will appear here...
          </Text>
        </View>
        <Text style={{ fontSize: 16, marginVertical: 6, marginTop: 'auto' }}>
          Joined at {prettyDateNoWeekday(iat)}
        </Text>
      </View>
    </ScrollView>
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
