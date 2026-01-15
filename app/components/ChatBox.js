"use client";

import { useState } from "react";
import { canais } from "../config/canais";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Olá! Sou o Flyer AI. Me diga que tipo de flyer você deseja criar." }
  ]);

  const [input, setInput] = useState("");
  const [step, setStep] = useState("produto");

  const [contexto, setContexto] = useState({
    area: null,
    tipo: null,
    subtipo: null,
    canal: null,
    formato: null,
    campanha: null
  });

  function addMessage(sender, text) {
    setMessages(prev => [...prev, { sender, text }]);
  }

  function identificarProduto(texto) {
    const text = texto.toLowerCase();

    if (text.includes("consórcio") || text.includes("consorcio")) {
      return { area: "financas", tipo: "consorcio" };
    }
    if (text.includes("seguro residencial")) {
      return { area: "seguros", tipo: "residencial" };
    }
    if (text.includes("pet")) {
      return { area: "beneficios", tipo: "pet" };
    }
    if (text.includes("saúde") || text.includes("saude")) {
      return { area: "beneficios", tipo: "saude" };
    }
    return null;
  }

  function sendMessage() {
    if (!input.trim()) return;

    const userText = input;
    addMessage("user", userText);

    // ETAPA 1 — PRODUTO
    if (step === "produto") {
      const resultado = identificarProduto(userText);

      if (!resultado) {
        addMessage(
          "bot",
          "Não entendi. Informe o produto corretamente (Consórcio, Seguro Residencial, Saúde, Pet)."
        );
      } else {
        setContexto(prev => ({ ...prev, ...resultado }));

        if (resultado.tipo === "consorcio") {
          addMessage(
            "bot",
            "Perfeito. Qual tipo de consórcio? (Auto, Imóvel ou Serviços)"
          );
          setStep("subtipo");
        } else {
          addMessage(
            "bot",
            "Ótimo. Esse flyer será para qual canal? (Instagram ou WhatsApp)"
          );
          setStep("canal");
        }
      }
    }

    // ETAPA 2 — SUBTIPO
    else if (step === "subtipo") {
      setContexto(prev => ({ ...prev, subtipo: userText.toLowerCase() }));

      addMessage(
        "bot",
        "Ótimo. Esse flyer será para qual canal? (Instagram ou WhatsApp)"
      );
      setStep("canal");
    }

    // ETAPA 3 — CANAL
    else if (step === "canal") {
      const canal = userText.toLowerCase();

      if (!canais[canal]) {
        addMessage("bot", "Canal inválido. Escolha Instagram ou WhatsApp.");
      } else {
        setContexto(prev => ({ ...prev, canal }));

        const formatosTexto = canais[canal].formatos
          .map(f => f.label)
          .join(" | ");

        addMessage(
          "bot",
          `Perfeito. Qual formato você deseja?\n${formatosTexto}`
        );

        setStep("formato");
      }
    }

    // ETAPA 4 — FORMATO
    else if (step === "formato") {
      const formatos = canais[contexto.canal].formatos;
      const formatoEscolhido = formatos.find(f =>
        f.label.toLowerCase().includes(userText.toLowerCase())
      );

      if (!formatoEscolhido) {
        addMessage("bot", "Formato inválido. Escolha um dos formatos listados.");
      } else {
        setContexto(prev => ({ ...prev, formato: formatoEscolhido }));

        addMessage("bot", "Qual campanha você deseja usar?");
        setStep("campanha");
      }
    }

    // ETAPA 5 — CAMPANHA
    else if (step === "campanha") {
      const payloadFinal = {
        ...contexto,
        campanha: userText
      };

      console.log("PAYLOAD FINAL:", payloadFinal);

      addMessage(
        "bot",
        "Perfeito! Já tenho todas as informações iniciais para criar seu flyer."
      );

      setStep("final");
    }

    setInput("");
  }

  return (
    <div style={styles.container}>
      <div style={styles.chat}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#1260c7" : "#f1f1f1",
              color: msg.sender === "user" ? "#ffffff" : "#000000"
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Enviar
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "40px auto",
    border: "1px solid #ddd",
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    height: "70vh"
  },
  chat: {
    flex: 1,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflowY: "auto"
  },
  message: {
    padding: "10px 14px",
    borderRadius: 16,
    maxWidth: "80%",
    fontSize: 14,
    whiteSpace: "pre-line"
  },
  inputArea: {
    display: "flex",
    borderTop: "1px solid #ddd"
  },
  input: {
    flex: 1,
    padding: 12,
    border: "none",
    outline: "none"
  },
  button: {
    padding: "0 20px",
    border: "none",
    backgroundColor: "#000",
    color: "#fff",
    cursor: "pointer"
  }
};

