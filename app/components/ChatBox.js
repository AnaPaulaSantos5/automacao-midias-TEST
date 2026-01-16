"use client";

import { useState } from "react";
import { identificarProduto } from "../utils/identificarProduto";
import { processarMensagem } from "../utils/chatEngine";

export default function ChatBox() {
  const [mensagens, setMensagens] = useState([
    { autor: "bot", texto: "Olá! Sou o Flyer AI. Me diga que tipo de flyer você deseja criar." }
  ]);

  const [estado, setEstado] = useState({
    produto: null,
    canal: null,
    formato: null,
    campanha: null,
    etapa: "produto"
  });

  function enviarMensagem(texto) {
    const novasMensagens = [...mensagens, { autor: "user", texto }];

    const resposta = proximaPergunta(texto, estado);

    setEstado(resposta.novoEstado);

    setMensagens([
      ...novasMensagens,
      ...(resposta.mensagem
        ? [{ autor: "bot", texto: resposta.mensagem }]
        : [])
    ]);
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ border: "1px solid #ccc", padding: 16, minHeight: 300 }}>
        {mensagens.map((m, i) => (
          <p key={i}>
            <strong>{m.autor === "bot" ? "Flyer AI" : "Você"}:</strong> {m.texto}
          </p>
        ))}
      </div>

      <InputChat onSend={enviarMensagem} />
    </div>
  );
}

function InputChat({ onSend }) {
  const [texto, setTexto] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!texto) return;
    onSend(texto);
    setTexto("");
  }

  return (
    <form onSubmit={submit} style={{ marginTop: 10 }}>
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Digite sua mensagem"
        style={{ width: "100%", padding: 10 }}
      />
    </form>
  );
}
