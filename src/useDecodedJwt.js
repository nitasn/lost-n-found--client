import * as React from 'react';
import { JwtContext } from './contexts';
import jwtDecode from 'jwt-decode';

export default function useDecodedJwt() {
  const jwt = React.useContext(JwtContext);
  return jwtDecode(jwt);
}
