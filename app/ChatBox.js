"use client";

import { useState } from "react";
import { flyersBase } from "./flyersBase";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Olá! Sou o Flyer AI. Me diga que tipo de flyer você deseja criar."
    }
  ]);

  const [input, setInput] = useState("");

  const [context, setContext] = useState({
    area: null,
    tipo: null,
    flyerConfig: null
  });

  function identificarFlyer(texto) {
    const text = texto.toLowerCase();

    if (text.includes("consórcio") || text.includes("consorcio")) {
      return { area: "financas", tipo: "consorcio" };
    }

    if (text.includes("pet")) {
      return { area: "beneficios", tipo: "pet" };
    }

    if (text.includes("saúde") || text.includes("saude")) {
      return { area: "beneficios", tipo: "saude" };
    }

    if (text.includes("odonto")) {
      return { area: "beneficios", tipo: "odonto" };
    }

    if (text.includes("seguro")) {
      return { area: "seguros", tipo: "seguro" };
    }

    return null;
  }

  function obterFlyerConfig(area, tipo) {
    return flyersBase?.[area]?.[tipo] || null;
  }

  function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    let botResponse = "";

    // ETAPA: ainda não identificou o flyer
    if (!context.tipo) {
      const resultado = identificarFlyer(input);

      if (!resultado) {
        botResponse =
          "Certo. Para eu te ajudar melhor, qual tipo de flyer você deseja criar? (Seguro, Consórcio, Odonto, Saúde ou Pet)";
      } else {
        const flyerConfig = obterFlyerConfig(
          resultado.area,
          resultado.tipo
        );

        if (!flyerConfig) {
          botResponse =
            "Identifiquei o tipo de flyer, mas ele ainda não está configurado no sistema.";
        } else {
          setContext({
            area: resultado.area,
            tipo: resultado.tipo,
            flyerConfig
          });

          botResponse = `Perfeito! Vamos criar um flyer de ${resultado.tipo} da área de ${resultado.area}.`;
        }
      }
    } else {
      // Próximas etapas (ainda não implementadas)
      botResponse =
        "Perfeito. Em breve vou te fazer algumas perguntas para montar esse flyer corretamente.";
    }

    setMessages((prev) => [
      ...prev,
      userMessage,
      { sender: "bot", text: botResponse }
    ]);

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
              alignSelf:
                msg.sender === "user" ? "flex-end" : "flex-start",
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