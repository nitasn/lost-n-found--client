import * as React from 'react';
import * as Location from 'expo-location';
import { extractFrom } from './utils';

/**
 * @param {{updateInterval?: number}}
 * @returns {undefined | null | {latitude: number, longitude: number}}
 */
export default function useLocation({ updateInterval }) {
  const [location, setLocation] = React.useState(undefined);

  React.useEffect(() => void asyncWork(), []);

  async function asyncWork() {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      return setLocation(null);
    }

    const { coords } = await Location.getCurrentPositionAsync();

    setLocation(extractFrom(coords, ['latitude', 'longitude']));

    if (updateInterval != undefined) {
      setTimeout(asyncWork, updateInterval);
    }
  }

  return location;
}
