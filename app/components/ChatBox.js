'use client';

import { useState } from 'react';

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [state, setState] = useState(null);

  async function sendMessage() {
    if (!input.trim()) return;

    setMessages(m => [...m, { role: 'user', text: input }]);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, state })
    });

    const data = await res.json();

    setMessages(m => [
      ...m,
      {
        role: 'bot',
        text: data.resposta,
        image: data.imageBase64 || null
      }
    ]);

    setState(data.state);
    setInput('');
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {messages.map((m, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <strong>{m.role === 'user' ? 'Você' : 'Bot'}:</strong>
          <div>{m.text}</div>

          {m.image && (
            <>
              <img
                src={`data:image/png;base64,${m.image}`}
                style={{ width: '100%', marginTop: 8 }}
              />
              <a
                href={`data:image/png;base64,${m.image}`}
                download="flyer-confi.png"
              >
                Baixar imagem
              </a>
            </>
          )}
        </div>
      ))}

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        placeholder="Digite sua mensagem"
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}