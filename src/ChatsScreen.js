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
  FlatList,
  Image,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import globalStyles from './globalStyles';
import { useFocusEffect } from '@react-navigation/native';
import { JwtContext, ChatContext } from './contexts';
import { sendPostReq, server, lastOf, zip } from './utils';
import jwtDecode from 'jwt-decode';
import useDecodedJwt from './useDecodedJwt';

import { firestore } from './init-firebase';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { collection, doc, getDoc, query, where } from 'firebase/firestore';
import { showCustomAlert } from './CustomAlert';

export default function({ navigation }) {
  useFocusEffect(() => {
    navigation.setOptions({ title: 'Chats' });
  });

  const { _id } = useDecodedJwt();

  const [chatsValue, chatsLoading, chatsError] = useDocument(
    doc(firestore, `chats-participations/${_id}`)
  );

  if (chatsLoading) return <CenteredText msg="loading chats..." />;
  if (chatsError) return <CenteredText msg={'chats error: ' + chatsError.message} />;
  const chatsValueData = chatsValue.data();
  if (!chatsValueData)
    return (
      <CenteredText
        msg={
          'No active chats.\n\n' +
          "To chat with a person, press the 'Contact' button on one of their posts <3"
        }
      />
    );

  const { 'refs-to-chats': refsToChats } = chatsValueData;
  const ids = [...refsToChats].map((ref) => lastOf(ref._key.path.segments));

  return <ListUsers {...{ ids, navigation }} myId={_id} />;
}

function ListUsers({ ids, navigation, myId }) {
  const { setCurrentChatId, setUserChattingWith } = React.useContext(ChatContext);

  const [chatIdToPartnerId, setChatIdToPartnerId] = React.useState({});

  React.useEffect(() => {
    let stillMounted = true;
    (async function fetchUsers() {
      const mongoIdOfPartners = await Promise.all(
        ids.map(async (id) => {
          const snapshot = await getDoc(doc(firestore, 'chats', id));
          return (
            snapshot.exists() &&
            snapshot.data().participants?.find((partId) => partId != myId)
          );
        })
      );
      if (!stillMounted) return;
      const res = await sendPostReq(server`/public/get-users`, {
        ids: mongoIdOfPartners,
      });
      const users = await res.json();
      if (stillMounted) setChatIdToPartnerId(Object.fromEntries(zip(ids, users)));
    })();
    return () => (stillMounted = false);
  }, [ids]);

  return (
    <FlatList
      data={ids}
      style={{ padding: 10, backgroundColor: '#ddd' }}
      renderItem={({ item: firestoreChatId, index }) => (
        <TouchableOpacity
          style={{
            padding: 12,
            marginBottom: index + 1 == ids.length ? 20 : 7,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f7f7f7',
            borderRadius: 12,
            ...globalStyles.shadow,
            shadowOpacity: 0.15,
          }}
          onPress={() => {
            const userChattingWith = chatIdToPartnerId[firestoreChatId];
            if (!userChattingWith) return; // plaster to avoid crash for now
            setCurrentChatId(firestoreChatId);
            setUserChattingWith(userChattingWith);
            navigation.navigate('ConversationScreen');
          }}
        >
          <Image
            style={{
              marginRight: 14,
              width: 60,
              aspectRatio: 1,
              borderRadius: Number.MAX_SAFE_INTEGER,
              overflow: 'hidden',
            }}
            source={{ uri: chatIdToPartnerId[firestoreChatId]?.profilePicUrl }}
          />

          <Text>{chatIdToPartnerId[firestoreChatId]?.name ?? 'loading...'}</Text>

          <Ionicons
            style={{ marginLeft: 'auto', marginRight: 4 }}
            size={20}
            color="dodgerblue"
            name="chatbubble-sharp"
          />
        </TouchableOpacity>
      )}
      keyExtractor={(_, index) => index}
    />
  );
}

function CenteredText({ msg }) {
  return (
    <View style={globalStyles.fullScreenAndCenter}>
      <Text style={{ maxWidth: 350 }}>{msg}</Text>
    </View>
  );
}
