// app/admin/page.tsx
'use client';

import { Table, Text } from '@mantine/core';
import {
    collection,
    DocumentData,
    onSnapshot,
    orderBy,
    query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';

export default function Admin() {
  const [requests, setRequests] = useState<DocumentData[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'pickUpRequests'),
      orderBy('timestamp', 'desc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(data);
    });

    return () => unsub();
  }, []);

  return (
    <div>
      <h1>Pick-Up Requests</h1>
      {requests.length > 0 ? (
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.name}</td>
                <td>{req.contact}</td>
                <td>{req.location}</td>
                <td>{new Date(req.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Text>No pick-up requests yet.</Text>
      )}
    </div>
  );
}
