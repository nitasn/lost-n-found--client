import { server } from './utils';
import * as React from 'react';

let timeoutId;

export default function usePosts() {
  // todo update every 60 seconds
  // every call to goFetch may schedule another, and we pass 'refresh', be carefull

  const [posts, setPosts] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => void goFetch(), []);

  async function goFetch() {
    try {
      const res = await fetch(server`/public/get-all-posts`);
      const json = await res.json();
      setPosts(json);
    } 
    catch (err) {
      setError(err.message);
      timeoutId = setTimeout(goFetch, 1000);
      // todo this doesn't work. it does resend a req until it gets a res,
      // but then the post just don't show up in the feed.
    }
  }

  async function refresh() {
    clearTimeout(timeoutId); // no effect if timeoutId is not set
    await goFetch();
  }

  return [posts, error, refresh];
}
