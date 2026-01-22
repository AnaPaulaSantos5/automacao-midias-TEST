'use client';

import { useState } from 'react';

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [state, setState] = useState(null);

  // 🔹 preview separado
  const [previewImage, setPreviewImage] = useState(null);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    let data;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          state
        })
      });

      data = await res.json();
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: 'Erro de conexão com o servidor.' }
      ]);
      return;
    }

    const botMessage = {
      role: 'bot',
      text: data.resposta
    };

    setMessages(prev => [...prev, botMessage]);
    setState(data.state || null);

    // 🔹 se vier imagem, seta preview
    if (data.imageBase64) {
      setPreviewImage(data.imageBase64);
    }
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 32,
        maxWidth: 1100,
        margin: '0 auto',
        padding: 24
      }}
    >
      {/* ================= CHAT ================= */}
      <div>
        <h2>Assistente Confi</h2>

        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: 16,
            minHeight: 300,
            marginBottom: 16
          }}
        >
          {messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: 12 }}>
              <strong>{msg.role === 'user' ? 'Você' : 'Bot'}:</strong>
              <div>{msg.text}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Digite sua mensagem"
            style={{ flex: 1, padding: 8 }}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Enviar</button>
        </div>
      </div>

      {/* ================= PREVIEW ================= */}
      <div>
        <h2>Preview do Flyer</h2>

        {!previewImage && (
          <div
            style={{
              border: '2px dashed #ccc',
              borderRadius: 8,
              height: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#777'
            }}
          >
            Nenhum flyer gerado ainda
          </div>
        )}

        {previewImage && (
          <div>
            <img
              src={`data:image/png;base64,${previewImage}`}
              alt="Flyer gerado"
              style={{
                width: '100%',
                borderRadius: 8,
                marginBottom: 12
              }}
            />

            <a
              href={`data:image/png;base64,${previewImage}`}
              download="flyer-confi.png"
            >
              <button style={{ width: '100%' }}>
                Baixar imagem
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}