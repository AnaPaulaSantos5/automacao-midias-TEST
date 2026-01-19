'use client';
import { useState } from 'react';

export default function Chat() {
  const [mensagem, setMensagem] = useState('');
  const [historico, setHistorico] = useState([]);

  async function enviar() {
    if (!mensagem.trim()) return;

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: mensagem })
    });

    const data = await res.json();

    setHistorico(h => [
      ...h,
      { autor: 'user', texto: mensagem },
      { autor: 'bot', texto: data.reply }
    ]);

    setMensagem('');
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <div>
        {historico.map((m, i) => (
          <p key={i}><strong>{m.autor}:</strong> {m.texto}</p>
        ))}
      </div>

      <input
        value={mensagem}
        onChange={e => setMensagem(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && enviar()}
        placeholder="Digite aqui..."
      />
      <button onClick={enviar}>Enviar</button>
    </div>
  );
}