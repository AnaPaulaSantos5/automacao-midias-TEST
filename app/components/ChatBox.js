'use client';

import { useState, useRef } from 'react';
import { chatEngine } from './utils/chatEngine';

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const contextRef = useRef({}); // 🔴 ESSENCIAL

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = {
      role: 'user',
      content: input
    };

    const botMsg = chatEngine(input, contextRef.current);

    setMessages(prev => [
      ...prev,
      userMsg,
      botMsg
    ]);

    setInput('');
  };

  return (
    <div>
      <div>
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
      />

      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}