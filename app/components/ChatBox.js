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

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, state })
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: 'bot', text: data.resposta }
      ]);

      setState(data.state || null);
      setPreviewImage(typeof data.imageBase64 === 'string' ? data.imageBase64 : null);

    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: 'Erro de conexão com o servidor.' }
      ]);
    }
  }

  const tabela = state?.tabela;
  const campanha = state?.campanha;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, maxWidth: 1100, margin: '0 auto', padding: 24 }}>

      {/* CHAT */}
      <div>
        <h2>Assistente Confi</h2>

        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, minHeight: 300 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <strong>{m.role === 'user' ? 'Você' : 'Bot'}:</strong>
              <div>{m.text}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
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

      {/* PREVIEW */}
      <div>
        <h2>Preview do Flyer</h2>

        {!previewImage && (
          <div style={{ border: '2px dashed #ccc', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Nenhum flyer gerado
          </div>
        )}

        {previewImage && (
          <>
            <img
              src={`data:image/png;base64,${previewImage}`}
              alt="Flyer"
              style={{ width: '100%', borderRadius: 8, marginBottom: 16 }}
            />

            {campanha?.titulo && <h3>{campanha.titulo}</h3>}

            {tabela && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {tabela.colunas.map((c, i) => (
                      <th key={i} style={{ borderBottom: '2px solid #1260c7', padding: 8 }}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tabela.linhas.map((linha, i) => (
                    <tr key={i}>
                      {linha.map((cell, j) => (
                        <td key={j} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}