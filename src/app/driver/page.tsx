// app/driver/page.tsx
'use client';

import { Text } from '@mantine/core';
import { doc, setDoc } from 'firebase/firestore';
import NoSleep from 'nosleep.js';
import { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';

export default function Driver() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const noSleep = new NoSleep();

    const enableNoSleep = () => {
      noSleep.enable();
      document.removeEventListener('click', enableNoSleep, false);
      document.removeEventListener('touchstart', enableNoSleep, false);
    };

    document.addEventListener('click', enableNoSleep, false);
    document.addEventListener('touchstart', enableNoSleep, false);

    let watchId: number;

    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            await setDoc(
              doc(db, 'shuttles', 'shuttle1'),
              {
                latitude,
                longitude,
                timestamp: Date.now(),
              },
              { merge: true }
            );
          } catch (e) {
            console.error('Error updating location:', e);
            setError('Error updating location.');
          }
        },
        (err) => {
          console.error(err);
          setError('Unable to retrieve your location.');
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
      noSleep.disable();
    };
  }, []);

  return (
    <div>
      <h1>Shuttle Driver Interface</h1>
      {error ? (
        <Text c="red">{error}</Text>
      ) : (
        <Text>Sharing your location... The screen will stay awake.</Text>
      )}
    </div>
  );
}
