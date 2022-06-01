import { server } from './utils';
import * as React from 'react';

export default function usePosts() {
  const [posts, setPosts] = React.useState(null);
  const [error, setError] = React.useState(null);

  const [dummyCounter, setDummyCounter] = React.useState(0);
  const refresh = () => setDummyCounter(dc => dc + 1);

  async function goFetch() {
    try {
      const res = await fetch(server`/public/get-all-posts`);
      const json = await res.json();
      setPosts(json);
    } 
    catch (err) {
      setError(err.message);
      setTimeout(goFetch, 1000);
    }
  }

  React.useEffect(() => void goFetch(), [dummyCounter]);

  return [posts, error, refresh];
}
