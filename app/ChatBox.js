"use client";

import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Olá! Sou o Flyer AI. Me diga que tipo de flyer você deseja criar."
    }
  ]);

  const [input, setInput] = useState("");

  const [flyer, setFlyer] = useState({
    area: null,
    tipo: null,
    produto: null,
    formato: null
  });

  function identificarTipo(texto) {
    const text = texto.toLowerCase();

    if (text.includes("consórcio") || text.includes("consorcio")) {
      return { tipo: "consórcio", area: "finanças" };
    }

    if (text.includes("pet")) {
      return { tipo: "pet", area: "benefícios" };
    }

    if (text.includes("saúde") || text.includes("saude")) {
      return { tipo: "saúde", area: "benefícios" };
    }

    if (text.includes("odonto")) {
      return { tipo: "odonto", area: "benefícios" };
    }

    if (text.includes("seguro")) {
      return { tipo: "seguro", area: "seguros" };
    }

    return null;
  }

  function responderBot(novoFlyer) {
    if (!novoFlyer.tipo) {
      return "Para eu te ajudar melhor, qual tipo de flyer você deseja criar? (Seguro, Consórcio, Odonto, Saúde ou Pet)";
    }

    if (novoFlyer.tipo === "consórcio" && !novoFlyer.produto) {
      return "Perfeito. Qual tipo de consórcio? (Auto, Imóvel ou Serviços)";
    }

    if (!novoFlyer.formato) {
      return "Ótimo. Esse flyer será para qual formato? (Instagram ou WhatsApp)";
    }

    return "Perfeito! Já tenho todas as informações para criar seu flyer.";
  }

  function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    let novoFlyer = { ...flyer };

    if (!flyer.tipo) {
      const identificacao = identificarTipo(input);
      if (identificacao) {
        novoFlyer.tipo = identificacao.tipo;
        novoFlyer.area = identificacao.area;
      }
    } else if (flyer.tipo === "consórcio" && !flyer.produto) {
      novoFlyer.produto = input.toLowerCase();
    } else if (!flyer.formato) {
      novoFlyer.formato = input.toLowerCase();
    }

    setFlyer(novoFlyer);

    const botMessage = {
      sender: "bot",
      text: responderBot(novoFlyer)
    };

    setMessages([...messages, userMessage, botMessage]);
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
              backgroundColor:
                msg.sender === "user" ? "#1260c7" : "#f1f1f1",
              color: msg.sender === "user" ? "#ffffff" : "#000000"
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
    fontSize: 14
  },
  inputArea: {
    display: "flex",
    borderTop: "1px solid #ddd"
  },
  input: {
    flex: 1,
    padding: 12,
    border: "none",
    outline: "none",
    fontSize: 14
  },
  button: {
    padding: "0 20px",
    border: "none",
    backgroundColor: "#000000",
    color: "#ffffff",
    cursor: "pointer"
  }
};