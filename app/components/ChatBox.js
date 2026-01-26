'use client';

import { useState } from 'react';

export default function ChatBox() {
  const [mensagens, setMensagens] = useState([]);
  const [input, setInput] = useState('');
  const [estado, setEstado] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  async function enviarMensagem() {
    if (!input.trim()) return;

    const msgUsuario = { autor: 'user', texto: input };
    setMensagens(prev => [...prev, msgUsuario]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mensagem: input,
        estado
      })
    });

    const data = await res.json();

    setMensagens(prev => [
      ...prev,
      { autor: 'bot', texto: data.resposta }
    ]);

    setEstado(data.estado || null);

    if (data.imageBase64) {
      setPreview(`data:image/png;base64,${data.imageBase64}`);
    }

    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto' }}>
      <div style={{ border: '1px solid #ccc', padding: 12, minHeight: 300 }}>
        {mensagens.map((m, i) => (
          <div key={i} style={{ textAlign: m.autor === 'user' ? 'right' : 'left' }}>
            <p><strong>{m.autor === 'user' ? 'Você' : 'Bot'}:</strong> {m.texto}</p>
          </div>
        ))}
        {loading && <p>Digitando...</p>}
      </div>

      {preview && (
        <div style={{ marginTop: 16 }}>
          <p><strong>Preview do Flyer:</strong></p>
          <img src={preview} alt="Flyer preview" style={{ width: '100%' }} />
        </div>
      )}

      <div style={{ display: 'flex', marginTop: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Digite aqui..."
          style={{ flex: 1 }}
        />
        <button onClick={enviarMensagem}>Enviar</button>
      </div>
    </div>
  );
}