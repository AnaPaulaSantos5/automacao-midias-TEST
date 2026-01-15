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

  const [step, setStep] = useState("identificar");

  const [flyerData, setFlyerData] = useState({
    area: null,
    tipo: null,
    subtipo: null,
    formato: null,
    campanha: null
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

  function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    let botResponse = "";

    // ETAPA 1 — IDENTIFICAR TIPO
    if (step === "identificar") {
      const resultado = identificarFlyer(input);

      if (!resultado) {
        botResponse =
          "Certo. Para eu te ajudar melhor, qual tipo de flyer você deseja criar? (Seguro, Consórcio, Odonto, Saúde ou Pet)";
      } else {
        setFlyerData((prev) => ({
          ...prev,
          area: resultado.area,
          tipo: resultado.tipo
        }));

        if (resultado.tipo === "consorcio") {
          botResponse =
            "Perfeito. Qual tipo de consórcio? (Auto, Imóvel ou Serviços)";
          setStep("subtipo");
        } else {
          botResponse =
            "Ótimo. Esse flyer será para qual formato? (Instagram ou WhatsApp)";
          setStep("formato");
        }
      }
    }

    // ETAPA 2 — SUBTIPO CONSÓRCIO
    else if (step === "subtipo") {
      setFlyerData((prev) => ({
        ...prev,
        subtipo: input.toLowerCase()
      }));

      botResponse =
        "Ótimo. Esse flyer será para qual formato? (Instagram ou WhatsApp)";
      setStep("formato");
    }

    // ETAPA 3 — FORMATO
    else if (step === "formato") {
      setFlyerData((prev) => ({
        ...prev,
        formato: input.toLowerCase()
      }));

      // ⚠️ AQUI ESTAVA O ERRO ANTES
      // NÃO FINALIZA — AVANÇA PARA CAMPANHA
      botResponse =
        botResponse =
  "ETAPA 7 ATIVA — QUAL CAMPANHA VOCÊ DESEJA USAR?";
    }

    // =====================
    // ETAPA 7 — CAMPANHA
    // =====================
    else if (step === "campanha") {
      setFlyerData((prev) => ({
        ...prev,
        campanha: input
      }));

      botResponse =
        "Perfeito! Já tenho todas as informações iniciais para criar seu flyer.";
      setStep("final");

      console.log("DADOS DO FLYER:", flyerData);
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
