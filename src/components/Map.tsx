// src/components/Map.tsx
'use client';

import { Text } from '@mantine/core';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

interface ShuttleLocation {
  latitude: number;
  longitude: number;
  timestamp?: number;
}

interface Shuttle {
  id: string;
  location: ShuttleLocation;
}

interface MapProps {
  shuttles: Shuttle[];
}

const Map = ({ shuttles }: MapProps) => {
  const defaultPosition: [number, number] = [10.6918, -61.2225]; // Replace with your default coordinates

  const centerPosition =
    shuttles.length > 0
      ? [shuttles[0].location.latitude, shuttles[0].location.longitude]
      : defaultPosition;

  // Create a custom icon
  const shuttleIcon = new Icon({
    iconUrl: '/shuttle-icon.png',
    iconSize: [80, 80],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  useEffect(() => {
    // Fix for default marker icon not showing
    delete (Icon.Default.prototype as any)._getIconUrl;
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer
        center={centerPosition}
        zoom={16}
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {shuttles.map((shuttle, index) => (
          <Marker
            key={shuttle.id}
            position={[shuttle.location.latitude, shuttle.location.longitude]}
            icon={shuttleIcon}
          >
            <Popup>{`Shuttle ${index + 1}`}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Overlay Branding */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 60,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          color: 'black',
          padding: '5px 10px',
          borderRadius: '8px',
        }}
      >
        <Image
          src="/IDB logo.png"
          alt="IDB Logo"
          width={50} // Adjust as needed
          height={30} // Adjust as needed
          style={{ marginRight: 10 }}
        />
        <Text size="lg" fw={700} c="black">
          P.A.N Yard Roadshow 2024
        </Text>
      </div>
    </div>
  );
};

export default Map;
