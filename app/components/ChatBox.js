'use client';

import { useState } from 'react';

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [state, setState] = useState(null);

  // Preview estruturado
  const [imageTop, setImageTop] = useState(null);
  const [tabela, setTabela] = useState(null);
  const [campanha, setCampanha] = useState(null);
  const [meses, setMeses] = useState(null);

  async function sendMessage() {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');

    let data;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, state })
      });

      data = await res.json();
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: 'Erro de conexão com o servidor.' }
      ]);
      return;
    }

    setMessages(prev => [
      ...prev,
      { role: 'bot', text: data.resposta }
    ]);

    setState(data.state || null);

    // 🔹 Dados para preview
    if (data.imageBase64) setImageTop(data.imageBase64);
    if (data.state?.tabela) setTabela(data.state.tabela);
    if (data.state?.campanha) setCampanha(data.state.campanha);
    if (data.state?.meses) setMeses(data.state.meses);
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 32,
        maxWidth: 1200,
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
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
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

        {!imageTop && (
          <div
            style={{
              border: '2px dashed #ccc',
              borderRadius: 8,
              height: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#777'
            }}
          >
            Nenhum flyer gerado ainda
          </div>
        )}

        {imageTop && (
          <div
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
            }}
          >
            {/* ===== TOPO (IMAGEM) ===== */}
            <div style={{ height: 260 }}>
              <img
                src={`data:image/png;base64,${imageTop}`}
                alt="Topo do flyer"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* ===== MEIO (TABELA) ===== */}
            <div
              style={{
                background: '#ffffff',
                padding: 20
              }}
            >
              {campanha?.textoPrincipal && (
                <h3 style={{ marginBottom: 8 }}>
                  {campanha.textoPrincipal}
                </h3>
              )}

              {meses && (
                <p style={{ marginBottom: 12, color: '#444' }}>
                  Prazo: {meses} meses
                </p>
              )}

              {tabela?.colunas?.length > 0 && (
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse'
                  }}
                >
                  <thead>
                    <tr>
                      {tabela.colunas.map((c, i) => (
                        <th
                          key={i}
                          style={{
                            borderBottom: '2px solid #1260c7',
                            padding: 8,
                            textAlign: 'left'
                          }}
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tabela.linhas.map((linha, i) => (
                      <tr key={i}>
                        {linha.map((cell, j) => (
                          <td
                            key={j}
                            style={{
                              padding: 8,
                              borderBottom: '1px solid #eee'
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* ===== FUNDO ===== */}
            <div
              style={{
                background: '#000',
                height: 100
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}