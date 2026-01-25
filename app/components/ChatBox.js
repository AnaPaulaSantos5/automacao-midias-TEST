'use client';

import { useState } from 'react';
import FlyerConsorcioTabela from './components/flyers/FlyerConsorcioTabela';

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [state, setState] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userText = input;

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: userText }
    ]);

    setInput('');
    setLoading(true);

    let data = null;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          state: state ?? null
        })
      });

      if (!res.ok) throw new Error('Erro HTTP');

      data = await res.json();
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Erro de conexão com o servidor.' }
      ]);
      setLoading(false);
      return;
    }

    // 🔒 Resposta textual
    setMessages((prev) => [
      ...prev,
      {
        role: 'bot',
        text:
          typeof data?.resposta === 'string'
            ? data.resposta
            : 'Ocorreu um erro ao processar a resposta.'
      }
    ]);

    // 🔒 State confiável
    if (data?.state && typeof data.state === 'object') {
      setState(data.state);
    }

    // 🔒 Imagem base (apenas fundo)
    if (
      typeof data?.imageBase64 === 'string' &&
      data.imageBase64.startsWith('iVBOR')
    ) {
      setPreviewImage(data.imageBase64);
    }

    setLoading(false);
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
      {/* CHAT */}
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
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <strong>{msg.role === 'user' ? 'Você' : 'Bot'}:</strong>
              <div>{String(msg.text)}</div>
            </div>
          ))}

          {loading && (
            <div style={{ color: '#888' }}>Processando...</div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem"
            style={{ flex: 1, padding: 8 }}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} disabled={loading}>
            Enviar
          </button>
        </div>
      </div>

      {/* PREVIEW */}
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

        {previewImage && state && (
          <FlyerConsorcioTabela
            data={{
              imageBase64: previewImage,
              subproduto: state.subproduto,
              meses: state.meses,
              campanha: state.campanha,
              tabela: state.tabela,
              lances: state.lances,
              rodapeLegal: state.rodapeLegal
            }}
          />
        )}
      </div>
    </div>
  );
}