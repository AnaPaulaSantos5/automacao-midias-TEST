"use client";

import { useState } from "react";
import { processarMensagem } from "../utils/chatEngine";
import produtos from "../data/produtos";

export default function ChatBox() {
  const [mensagens, setMensagens] = useState([
    { autor: "bot", texto: "Olá! Sou o Flyer AI. Me diga que tipo de flyer você deseja criar." }
  ]);

  const [input, setInput] = useState("");

  const [estado, setEstado] = useState({
    step: "inicio",
    produto: null,
    canal: null,
    formato: null,
    campanha: null
  });

  function enviarMensagem(e) {
    e.preventDefault();

    if (!input.trim()) return;

    const mensagemUsuario = input;

    setMensagens((prev) => [
      ...prev,
      { autor: "user", texto: mensagemUsuario }
    ]);

    const flyerConfig = produtos[estado.produto];

    const resposta = processarMensagem(
      estado,
      mensagemUsuario,
      flyerConfig
    );

    if (resposta?.texto) {
      setMensagens((prev) => [
        ...prev,
        { autor: "bot", texto: resposta.texto }
      ]);
    }

    if (resposta?.novoState) {
      setEstado(resposta.novoState);
    }

    setInput("");
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ minHeight: 300, padding: 16, border: "1px solid #ddd" }}>
        {mensagens.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.autor === "bot" ? "left" : "right",
              marginBottom: 8
            }}
          >
            <strong>{msg.autor === "bot" ? "Flyer AI" : "Você"}:</strong>{" "}
            {msg.texto}
          </div>
        ))}
      </div>

      <form onSubmit={enviarMensagem} style={{ display: "flex", marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua resposta..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Enviar
        </button>
      </form>
    </div>
  );
}