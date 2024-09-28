// src/app/page.tsx
'use client';

import { db } from '@/firebaseConfig';
import {
  AppShell,
  Stack,
  Text
} from '@mantine/core';
import { collection, onSnapshot } from 'firebase/firestore';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

interface ShuttleLocation {
  latitude: number;
  longitude: number;
  timestamp?: number;
}

interface Shuttle {
  id: string;
  location: ShuttleLocation;
}

const MapWithNoSSR = dynamic(() => import('@/components/Map'), {
  ssr: false,
});

export default function Home() {
  const [shuttles, setShuttles] = useState<Shuttle[]>([]);

  useEffect(() => {
    // Subscribe to shuttle location updates
    const unsub = onSnapshot(collection(db, 'shuttles'), (snapshot) => {
      const shuttleData = snapshot.docs.map((doc) => ({
        id: doc.id,
        location: doc.data() as ShuttleLocation,
      }));
      setShuttles(shuttleData);
    });

    return () => unsub();
  }, []);

  return (
    <AppShell
    header={{ height: 60, offset: false }}
    >
      <Stack gap="md">
        

        {/* Map Section */}
        {shuttles.length > 0 ? (
          <div>
            <MapWithNoSSR shuttles={shuttles} />
          </div>
        ) : (
          <Text>Loading shuttle locations...</Text>
        )}
      </Stack>
    </AppShell>
  );
}
