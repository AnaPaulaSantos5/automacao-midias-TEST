"use client";

import { useState, useRef, useEffect } from "react";
import { processarMensagem } from "../utils/chatEngine";
import flyersBase from "../flyersBase";

export default function ChatBox() {
  const [mensagens, setMensagens] = useState([
    {
      autor: "bot",
      texto: "Olá! Sou o Flyer AI. Me diga que tipo de flyer você deseja criar."
    }
  ]);

  const [input, setInput] = useState("");
  const [state, setState] = useState({ step: "inicio" });
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [mensagens]);

  function enviarMensagem() {
    if (!input.trim()) return;

    const flyerConfig =
      state.area && state.produto
        ? flyersBase[state.area]?.[state.produto]
        : null;

    const resposta = processarMensagem(state, input, flyerConfig);

    setMensagens((prev) => [
      ...prev,
      { autor: "user", texto: input },
      { autor: "bot", texto: resposta.texto }
    ]);

    setState(resposta.novoState);
    setInput("");
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div
        ref={chatRef}
        style={{
          height: 400,
          overflowY: "auto",
          padding: 16,
          border: "1px solid #ddd",
          marginBottom: 8
        }}
      >
        {mensagens.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <b>{m.autor === "bot" ? "Flyer AI" : "Você"}:</b> {m.texto}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
          placeholder="Digite sua mensagem..."
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={enviarMensagem}>Enviar</button>
      </div>
    </div>
  );
}
