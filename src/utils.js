import Constants from 'expo-constants';
export const deviceName = Constants.deviceName;

export function prettyDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function prettyDateNoWeekday(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * given a date (or a unix timestamp), returns a string like "2 days ago"
 */
export const timeDeltaAsString = (() => {
  const units = {
    year: 24 * 60 * 60 * 1000 * 365.24,
    month: (24 * 60 * 60 * 1000 * 365.24) / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
  };

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  /**
   * @param {number|Date|string} timestamp in the past or in the future
   * @param {number|Date} reference defaults to Date.now()
   */
  return (timestamp, reference = Date.now()) => {
    timestamp = +new Date(timestamp);
    const elapsed = timestamp - reference;

    // "Math.abs" accounts for both "past" & "future" scenarios
    for (const u in units) {
      if (Math.abs(elapsed) > units[u] || u == 'second') {
        return rtf.format(Math.round(elapsed / units[u]), u);
      }
    }
  };
})();

/**
 * The Haversine Formula
 * @param {Number} lat1
 * @param {Number} lon1
 * @param {Number} lat2
 * @param {Number} lon2
 * @returns {Number}
 */
export default function geoDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  lat1 = toRad(lat1);
  lat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(Value) {
  return (Value * Math.PI) / 180;
}

export const newID = (() => {
  let current = 0;
  return () => {
    return current++;
  };
})();

export const capitalize = (phrase) => {
  return phrase
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * @param {Object} body
 */
export function sendPostReq(url, body) {
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(body),
  });
}

import { SERVER_URL } from './constants';

/**
 * prefix with SERVER_URL
 *
 * `` server`/hello/there` `` --> `` 'http://localhost:3000/hello/there' ``
 */
export function server({ raw: strings }, ...rest) {
  const parts = [(strings[0].startsWith('/') ? '' : '/') + strings[0]];
  for (let i = 0; i < rest.length; i++) {
    parts.push(rest[i]);
    parts.push(strings[i + 1]);
  }
  const path = parts.join('');
  return SERVER_URL + path;
}

export function extractFrom(obj, keys) {
  return keys.reduce((res, key) => {
    if (key in obj) res[key] = obj[key];
    return res;
  }, {});
}