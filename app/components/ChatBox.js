'use client';

import { useState, useRef } from 'react';
import { chatEngine } from '../utils/chatEngine';

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const contextRef = useRef({}); // CONTEXTO PERSISTENTE

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = {
      role: 'user',
      content: input
    };

    const resposta = chatEngine(input, contextRef.current);

    // 🔒 PROTEÇÃO ABSOLUTA
    if (!resposta || !resposta.content) {
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      return;
    }

    const botMsg = {
      role: 'assistant',
      content: resposta.content
    };

    setMessages(prev => [
      ...prev,
      userMsg,
      botMsg
    ]);

    // Caso especial: prompt pronto para API
    if (resposta.gerarPrompt) {
      console.log('Payload para API:', resposta.payload);
      // aqui você liga com a geração de imagem depois
    }

    setInput('');
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ minHeight: 300, border: '1px solid #ccc', padding: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        placeholder="Digite sua mensagem..."
        style={{ width: '100%', marginTop: 10 }}
      />

      <button onClick={sendMessage} style={{ marginTop: 10 }}>
        Enviar
      </button>
    </div>
  );
}