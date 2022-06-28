import * as Linking from 'expo-linking';

export default {
  prefixes: [
    'https://lost-n-found-nitsan.herokuapp.com/',
    Linking.createURL('lostnfound://'),
    Linking.createURL('/'), // which one of them works...?
  ],

  // todo PostScreen params are weird...
  // when visiting from a link "server/post/some-id" it's good,
  // but when navigating through the app, the url includes an "undefined" id,
  // and a url-decoded "[Object object]" postViewed

  config: {
    screens: {
      FeedStack: {
        initialRouteName: 'Feed',

        screens: {
          Feed: 'feed',
          ImagesModal: 'images',
          UserModal: 'user',
          FilterPicker: 'filter',
          PostScreen: 'post/:id',
        },
      },

      ChatsStack: {
        initialRouteName: 'ChatsScreen',

        screens: {
          ChatsScreen: 'chats',
          ConversationScreen: 'conversation',
        },
      },

      MoreStack: {
        initialRouteName: 'MorePage',

        screens: {
          MorePage: 'more',
          MyProfile: 'my-profile',
          PostComposer: 'compose-post',
          MyPosts: 'my-posts',
          PostScreen: 'my-post',
          ImagesModal: 'my-post-images'
        },
      },

      NotFound: '*',
    },
  },
};
