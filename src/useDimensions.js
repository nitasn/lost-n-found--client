import * as React from 'react';
import { Dimensions } from 'react-native';


export default function useDimensions() {
  const [dimensions, setDimensions] = React.useState(Dimensions.get('window'));

  React.useEffect(() => {
    Dimensions.addEventListener('change', ({ window }) => setDimensions(window));
  }, []);

  return dimensions;
}
