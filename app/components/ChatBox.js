'use client';

import { useState } from 'react';
import { initialState } from '../data/state';

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setLoading(true);

    setMessages(prev => [
      ...prev,
      { role: 'user', text: userText }
    ]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          state
        })
      });

      const data = await res.json();

      if (data.state) {
        setState(data.state);
      }

      if (data.resposta) {
        setMessages(prev => [
          ...prev,
          { role: 'bot', text: data.resposta }
        ]);
      }

      if (data.imageUrl) {
        setMessages(prev => [
          ...prev,
          { role: 'bot', image: data.imageUrl }
        ]);
      }

    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: 'Erro ao comunicar com o servidor.' }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 500 }}>
      <div style={{ minHeight: 300 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            {m.text && (
              <p><strong>{m.role}:</strong> {m.text}</p>
            )}
            {m.image && (
              <img
                src={m.image}
                alt="Flyer gerado"
                style={{ width: '100%', borderRadius: 8 }}
              />
            )}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        placeholder="Digite sua mensagem"
        disabled={loading}
      />

      <button onClick={sendMessage} disabled={loading}>
        {loading ? 'Gerando...' : 'Enviar'}
      </button>
    </div>
  );
}