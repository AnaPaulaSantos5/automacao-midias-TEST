'use client';
import { useState } from 'react';

export default function Home() {
  const [mensagem, setMensagem] = useState('');
  const [estado, setEstado] = useState(null);
  const [image, setImage] = useState(null);
  const [chat, setChat] = useState([]);

  async function enviar() {
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ mensagem, estado })
    });
    const data = await res.json();

    setChat(c => [...c, { user: mensagem }, { bot: data.resposta }]);
    setEstado(data.estado);
    if (data.image) setImage(data.image);
    setMensagem('');
  }

  return (
    <div style={{ padding: 40 }}>
      {chat.map((m, i) => <p key={i}>{m.user || m.bot}</p>)}

      <input value={mensagem} onChange={e => setMensagem(e.target.value)} />
      <button onClick={enviar}>Enviar</button>

      {image && <img src={image} style={{ width: 400, marginTop: 40 }} />}
    </div>
  );
}