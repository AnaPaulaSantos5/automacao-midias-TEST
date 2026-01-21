'use client';

import { useState } from 'react';

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [state, setState] = useState(null);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: input,
        state
      })
    });

    const data = await res.json();

    const botMessage = {
      role: 'bot',
      text: data.resposta,
      imageUrl: data.imageUrl || null
    };

    setMessages(prev => [...prev, botMessage]);
    setState(data.state);
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: 16 }}>
            <strong>{msg.role === 'user' ? 'Você' : 'Bot'}:</strong>
            <div>{msg.text}</div>

            {msg.imageUrl && (
              <img
                src={msg.imageUrl}
                alt="Flyer gerado"
                style={{
                  marginTop: 8,
                  width: '100%',
                  borderRadius: 8
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Digite sua mensagem"
          style={{ flex: 1 }}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}