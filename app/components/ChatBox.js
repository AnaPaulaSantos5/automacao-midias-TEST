"use client";

import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Olá! Sou o Flyer AI. Me diga que tipo de flyer você deseja criar." }
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
    if (text.includes("pet")) return { area: "beneficios", tipo: "pet" };
    if (text.includes("saúde") || text.includes("saude")) return { area: "beneficios", tipo: "saude" };
    if (text.includes("odonto")) return { area: "beneficios", tipo: "odonto" };
    if (text.includes("seguro")) return { area: "seguros", tipo: "seguro" };

    return null;
  }

  function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    let botResponse = "";

    if (step === "identificar") {
      const resultado = identificarFlyer(input);

      if (!resultado) {
        botResponse =
          "Certo. Para eu te ajudar melhor, qual tipo de flyer você deseja criar? (Seguro, Consórcio, Odonto, Saúde ou Pet)";
      } else {
        setFlyerData((prev) => ({ ...prev, ...resultado }));

        if (resultado.tipo === "consorcio") {
          botResponse = "Perfeito. Qual tipo de consórcio? (Auto, Imóvel ou Serviços)";
          setStep("subtipo");
        } else {
          botResponse = "Ótimo. Esse flyer será para qual formato? (Instagram ou WhatsApp)";
          setStep("formato");
        }
      }
    }

    else if (step === "subtipo") {
      setFlyerData((prev) => ({ ...prev, subtipo: input }));
      botResponse = "Ótimo. Esse flyer será para qual formato? (Instagram ou WhatsApp)";
      setStep("formato");
    }

    else if (step === "formato") {
      setFlyerData((prev) => ({ ...prev, formato: input }));
      botResponse = "Qual campanha você deseja usar?";
      setStep("campanha");
    }

    else if (step === "campanha") {
      setFlyerData((prev) => ({ ...prev, campanha: input }));
      botResponse = "Perfeito! Já tenho todas as informações iniciais para criar seu flyer.";
      setStep("final");
    }

    setMessages((prev) => [...prev, userMessage, { sender: "bot", text: botResponse }]);
    setInput("");
  }

  return (
    <div style={styles.container}>
      <div style={styles.chat}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#1260c7" : "#f1f1f1",
              color: msg.sender === "user" ? "#fff" : "#000"
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
        <button onClick={sendMessage} style={styles.button}>Enviar</button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 600, margin: "40px auto", border: "1px solid #ddd", borderRadius: 8, display: "flex", flexDirection: "column", height: "70vh" },
  chat: { flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" },
  message: { padding: "10px 14px", borderRadius: 16, maxWidth: "80%", fontSize: 14 },
  inputArea: { display: "flex", borderTop: "1px solid #ddd" },
  input: { flex: 1, padding: 12, border: "none", outline: "none" },
  button: { padding: "0 20px", border: "none", backgroundColor: "#000", color: "#fff", cursor: "pointer" }
};
