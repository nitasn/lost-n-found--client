import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { Platform } from 'react-native';
import { showCustomAlert } from './CustomAlert';
import { server, sendPostReq, deviceName } from './utils';

let workingOnIt = false;

export default function useJwt(name) {
  const [value, setValue] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => void asyncWork(), [workingOnIt, value]);

  async function asyncWork() {
    if (value || workingOnIt) return;
    workingOnIt = true;

    const oldJwt = await AsyncStorage.getItem('jwt');

    if (oldJwt) {
      workingOnIt = false;
      return setError(null), setValue(oldJwt);
    }

    let newJwt;

    try {
      newJwt = await requestNewJwt(name);
    } catch {
      workingOnIt = false;
      return setError('Could not get a new JWT');
    }

    try {
      await AsyncStorage.setItem('jwt', newJwt);
      setValue(newJwt);
    } catch {
      setError('Could not store JWT locally');
    } finally {
      workingOnIt = false;
    }
  }

  return [value, error];
}

async function requestNewJwt(name) {
  const res = await sendPostReq(server`/public/register-annon`, {
    name,
    platform: Platform.OS,
  });
  const { error, token } = await res.json();
  if (error) throw error;
  else return token;
}

function alertCouldNotGetNewJwt() {
  showCustomAlert({
    header: 'Network Problem',
    body: 'Could not connect to server!'
  })
}

function alertCouldNotStroreJwtLocally() {
  showCustomAlert({
    header: 'Storage Error',
    body: 'An annon-user was successfully created for you - ' +
      'but then your device refused to store it. ' +
      'Please make sure to allow storage permissions.'
});
}
