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
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import globalStyles from './globalStyles';
import { useFocusEffect } from '@react-navigation/native';
import dummyMessages from './dummyMessages.json';
import { ChatContext, JwtContext } from './contexts';
import { timeDeltaAsString, capitalize } from './utils';
import useDecodedJwt from './useDecodedJwt';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { firestore } from './init-firebase';
import { addDoc, collection, doc, Query, setDoc } from 'firebase/firestore';

function useMessages() {
  const { currentChatId } = React.useContext(ChatContext);

  const myJwt = useDecodedJwt();

  const [messagesValue, messagesLoading, messagesError] = useCollection(
    collection(firestore, `chats/${currentChatId}/messages`)
  );

  const messages = messagesValue?.docs
    .map((doc) => {
      const { sender, text, time } = doc.data();
      return {
        isByMe: sender == myJwt._id,
        time: time.seconds * 10 ** 3 + time.nanoseconds / 10 ** 6,
        text,
        id: doc.id,
      };
    })
    .sort((msg1, msg2) => msg1.time - msg2.time);

  return [messages, messagesLoading, messagesError];
}

export default function ({ navigation }) {
  const listRef = React.useRef();

  React.useEffect(() => {
    const id = setTimeout(() => listRef.current?.scrollToEnd(), 500);
    return () => clearTimeout(id);
  }, []);

  const [msg, setMsg] = React.useState('');
  const inputRef = React.useRef();

  React.useEffect(() => {
    setMsg(msg.trimStart());
  }, [msg]);

  const { currentChatId, userChattingWith } = React.useContext(ChatContext);
  const myJwt = useDecodedJwt();

  useFocusEffect(() => {
    navigation.setOptions({ title: capitalize(userChattingWith.name) });
  });

  React.useEffect(() => onUnmount);

  const [isSending, setIsSending] = React.useState(false);

  const [messages, messagesLoading, messagesError] = useMessages();

  if (messagesLoading) return <CenteredText />;
  if (messagesError) return <CenteredText msg={'error :( ' + messagesError.message} />;

  function onUnmount() {
    // 
  }

  const MessagesArea = View;
  const InputArea = View;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={60}
      // todo try "eact-native-keyboard-aware-scroll-view"
    >
      <View style={{ flex: 1 }}>
        <MessagesArea
          style={[
            globalStyles.fullScreenAndCenter,
            { backgroundColor: '#1b2842', flex: 1 },
          ]}
        >
          <FlatList
            style={{ padding: 8, paddingTop: 15, width: '100%' }}
            data={messages}
            ref={listRef}
            renderItem={({ item, index }) => {
              return (
                <Message
                  {...item}
                  style={{
                    marginBottom:
                      index + 1 == messages.length
                        ? 35
                        : messages[index].isByMe != messages[index + 1].isByMe
                        ? 25
                        : 5,
                  }}
                />
              );
            }}
            keyExtractor={({ id }) => id}
          />
        </MessagesArea>
        <InputArea
          style={{
            flexDirection: 'row',
            alignSelf: 'stretch',
            alignItems: 'center',
            padding: 8,
            paddingRight: 12,
            backgroundColor: '#2f4269',
            borderTopWidth: 1,

            ...globalStyles.shadow,
            shadowOffset: { height: -2 },
            shadowOpacity: 0.3,
          }}
        >
          <TouchableOpacity style={{ flex: 1 }} onPress={inputRef.current?.focus()}>
            <TextInput
              style={{ padding: 12, fontSize: 18, color: 'white' }}
              onChangeText={setMsg}
              value={msg}
              placeholder="Type something..."
              placeholderTextColor="rgba(255, 255, 255, .5)"
              ref={inputRef}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => void sendMsg()}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              // paddingRight: 13,
              borderRadius: 8,
              borderRadius: Number.MAX_SAFE_INTEGER,
              backgroundColor: '#1b2842',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ color: 'white' }}>{!isSending ? 'SEND' : 'SENDING...'}</Text>
            </View>
          </TouchableOpacity>
        </InputArea>
      </View>
    </KeyboardAvoidingView>
  );

  async function sendMsg() {
    setIsSending(true);
    await addDoc(collection(firestore, 'chats', currentChatId, 'messages'), {
      sender: myJwt._id,
      time: new Date(),
      text: msg.trim(),
    });
    setIsSending(false);
    setMsg('');
    listRef.current?.scrollToEnd();
  }
}

function Message({ isByMe, time, text, style }) {
  return (
    <View
      style={{
        alignSelf: isByMe ? 'flex-end' : 'flex-start',
        backgroundColor: isByMe ? '#7ab8ff' : '#8cb8bf',
        padding: 10,
        maxWidth: '80%',
        borderRadius: 8,
        ...style,
        ...globalStyles.shadow,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          margin: 6,
          [!isByMe ? 'marginRight' : 'marginLeft']: 8,
          color: 'rgba(0, 0, 0, .8)',
        }}
      >
        {text}
      </Text>
      <Text style={{ fontSize: 12, textAlign: 'right', color: 'rgba(0, 0, 0, .5)' }}>
        {new Date(time).toLocaleTimeString([], { timeStyle: 'short' })}
      </Text>
    </View>
  );
}

function CenteredText({ msg }) {
  return (
    <View style={{ ...globalStyles.fullScreenAndCenter, backgroundColor: '#1b2842' }}>
      <Text style={{ color: '#eee' }}>{msg}</Text>
    </View>
  );
}
