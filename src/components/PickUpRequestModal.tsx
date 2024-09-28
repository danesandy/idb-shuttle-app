// src/components/PickUpRequestModal.tsx
'use client';

import { db } from '@/firebaseConfig';
import { Button, Select, Stack, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';

interface PickUpRequestModalProps {
  onClose: () => void;
}

const PickUpRequestModal: React.FC<PickUpRequestModalProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'pickUpRequests'), {
        name,
        contact,
        location,
        timestamp: Date.now(),
      });
      modals.closeAll();
      alert('Pick-up request submitted successfully!');
    } catch (e) {
      console.error('Error submitting pick-up request:', e);
      alert('Failed to submit pick-up request.');
    }
  };

  return (
    <Stack gap="sm">
      <TextInput
        label="Full Name"
        placeholder="Your name"
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
        required
      />
      <TextInput
        label="Contact Number"
        placeholder="Your contact number"
        value={contact}
        onChange={(event) => setContact(event.currentTarget.value)}
        required
      />
      <Select
        label="Pick-Up Location"
        placeholder="Select location"
        data={[
          { value: 'locationA', label: 'Location A' },
          { value: 'locationB', label: 'Location B' },
        ]}
        value={location}
        onChange={(value) => setLocation(value as string)}
        required
      />
      <Button onClick={handleSubmit} mt="md">
        Submit Request
      </Button>
      <Button variant="light" fullWidth onClick={onClose} mt="md">
        Close
      </Button>
    </Stack>
  );
};

export default PickUpRequestModal;
