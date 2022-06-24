import * as React from 'react';
import * as Location from 'expo-location';
import { extractFrom } from './utils';

const ONE_MINUTE = 1000 * 60;

/**
 * @param {{updateEvery?: number}} in millis
 * @returns {undefined | null | {latitude: number, longitude: number}}
 */
export default function useLocation({ updateEvery } = { updateEvery: ONE_MINUTE }) {
  const [location, setLocation] = React.useState(undefined);

  let isStillMounted = true;

  React.useEffect(() => {
    asyncWork();
    return () => (isStillMounted = false);
  }, []);

  async function asyncWork() {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      return isStillMounted && setLocation(null);
    }

    try {
      const { coords } = await Location.getCurrentPositionAsync();

      if (!isStillMounted) return;

      setLocation(extractFrom(coords, ['latitude', 'longitude']));

      if (Number.isFinite(updateEvery) && updateEvery >= 0) {
        setTimeout(asyncWork, updateEvery);
      }
    } 
    catch {
      isStillMounted && setTimeout(asyncWork, 1000);
    }
  }

  return location;
}
