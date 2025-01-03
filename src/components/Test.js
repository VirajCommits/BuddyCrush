// src/pages/api/test.js
"use client"
import { useState, useEffect } from 'react';

export default function Test() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchMessage() {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/test'); // Flask endpoint
        const data = await response.json();
        setMessage(data.message); // Update state with the response
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Failed to connect to backend');
      }
    }

    fetchMessage();
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Frontend to Backend Test</h1>
      <p>{message}</p>
    </div>
  );
}
