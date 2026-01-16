"use client";

import { useState } from "react";
import { processarMensagem } from "../utils/chatEngine";
import flyersBase from "../flyersBase";

export default function ChatBox() {
  const [mensagens, setMensagens] = useState([
    { autor: "bot", texto: "Olá! Sou o Flyer AI. Me diga que tipo de flyer você deseja criar." }
  ]);

  const [input, setInput] = useState("");

  const [state, setState] = useState({
    step: "INICIO",
    tipo: null,
    produto: null,
    canal: null,
    formato: null,
    campanha: null,
    detalhes: {}
  });

  function enviarMensagem() {
    if (!input.trim()) return;

    const novaMensagemUsuario = {
      autor: "user",
      texto: input
    };

    const resultado = processarMensagem(
      state,
      input,
      obterFlyerConfig(state)
    );

    const novaMensagemBot = {
      autor: "bot",
      texto: resultado.texto
    };

    setMensagens((prev) => [...prev, novaMensagemUsuario, novaMensagemBot]);
    setState(resultado.novoState);
    setInput("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      enviarMensagem();
    }
  }

  function obterFlyerConfig(state) {
    if (!state.tipo || !state.produto) return null;

    return (
      flyersBase?.[state.tipo]?.[state.produto] || null
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.chat}>
        {mensagens.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.mensagem,
              alignSelf: msg.autor === "user" ? "flex-end" : "flex-start",
              background: msg.autor === "user" ? "#DCF8C6" : "#EEE"
            }}
          >
            {msg.texto}
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={styles.input}
        />
        <button onClick={enviarMensagem} style={styles.botao}>
          Enviar
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: 500,
    margin: "40px auto",
    border: "1px solid #ccc",
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    height: "80vh"
  },
  chat: {
    flex: 1,
    padding: 12,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 8
  },
  mensagem: {
    padding: "8px 12px",
    borderRadius: 6,
    maxWidth: "80%",
    fontSize: 14
  },
  inputArea: {
    display: "flex",
    borderTop: "1px solid #ccc"
  },
  input: {
    flex: 1,
    padding: 10,
    border: "none",
    outline: "none",
    fontSize: 14
  },
  botao: {
    padding: "0 16px",
    border: "none",
    background: "#000",
    color: "#fff",
    cursor: "pointer"
  }
};
