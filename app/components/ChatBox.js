'use client';

import { useState } from 'react';

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [state, setState] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  async function sendMessage() {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');

    let data;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, state })
      });
      data = await res.json();
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Erro de conexão.' }]);
      return;
    }

    setMessages(prev =>