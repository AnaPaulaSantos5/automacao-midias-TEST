'use client';

import { useState } from 'react';
import { initialState } from '../app/data/state';

export default function ChatBox() {
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [state, setState] = useState(initialState);

  async function enviarMensagem(e) {
    e.preventDefault();
    if (!texto.trim()) return;

    const userMsg = texto;
    setTexto('');
    setMensagens(prev => [...prev, { autor: 'user', texto: userMsg }]);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMsg,
        state
      })
    });

    const data = await res.json();

    if (!data?.resposta || !data?.state) {
      console.error('Resposta inválida da API', data);
      return;
    }

    setMensagens(prev => [...prev, { autor: 'bot', texto: data.resposta }]);
    setState(data.state);
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <div style={{ minHeight: 300, border: '1px solid #ccc', padding: 10 }}>
        {mensagens.map((m, i) => (
          <p key={i}><strong>{m.autor}:</strong> {m.texto}</p>
        ))}
      </div>

      <form onSubmit={enviarMensagem}>
        <input
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="Digite aqui..."
          style={{ width: '100%', padding: 8 }}
        />
      </form>
    </div>
  );
}