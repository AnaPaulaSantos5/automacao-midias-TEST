"use client";

import { useState } from "react";

/**
 * DEFINIÇÃO DOS PRODUTOS
 */
const produtos = {
  consorcio: {
    area: "financas",
    nome: "Consórcio",
    subtipos: ["auto", "imóvel", "serviços"]
  },
  seguro_residencial: {
    area: "seguros",
    nome: "Seguro Residencial",
    subtipos: ["seguro residencial"]
  },
  pet: {
    area: "beneficios",
    nome: "Seguro Pet",
    subtipos: ["pet"]
  },
  saude: {
    area: "beneficios",
    nome: "Seguro Saúde",
    subtipos: ["saúde"]
  },
  odonto: {
    area: "beneficios",
    nome: "Seguro Odonto",
    subtipos: ["odonto"]
  }
};

/**
 * DETECTA PRODUTO EM QUALQUER ETAPA
 */
function detectarProduto(texto) {
  const t = texto.toLowerCase();

  if (t.includes("consórcio") || t.includes("consorcio")) return "consorcio";
  if (t.includes("seguro residencial")) return "seguro_residencial";
  if (t.includes("pet")) return "pet";
  if (t.includes("saúde") || t.includes("saude")) return "saude";
  if (t.includes("odonto")) return "odonto";

  return null;
}

export default function ChatBox() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Olá! Sou o Flyer AI. Me diga que tipo de flyer você deseja criar."
    }
  ]);

  const [input, setInput] = useState("");
  const [step, setStep] = useState("produto");

  const [contexto, setContexto] = useState({
    produtoKey: null,
    subtipo: null,
    formato: null,
    campanha: null
  });

  function adicionarMensagem(sender, text) {
    setMessages((prev) => [...prev, { sender, text }]);
  }

  function sendMessage() {
    if (!input.trim()) return;

    const textoUsuario = input;
    adicionarMensagem("user", textoUsuario);

    /**
     * 🔁 CORREÇÃO PRINCIPAL
     * Detecta produto em QUALQUER etapa
     */
    const produtoDetectado = detectarProduto(textoUsuario);

    if (produtoDetectado && produtoDetectado !== contexto.produtoKey) {
      const produto = produtos[produtoDetectado];

      setContexto({
        produtoKey: produtoDetectado,
        subtipo: null,
        formato: null,
        campanha: null
      });

      setStep("subtipo");

      adicionarMensagem(
        "bot",
        `Perfeito! Qual tipo de ${produto.nome}? (${produto.subtipos.join(
          ", "
        )})`
      );

      setInput("");
      return;
    }

    /**
     * ETAPAS NORMAIS
     */
    if (step === "subtipo") {
      setContexto((prev) => ({
        ...prev,
        subtipo: textoUsuario.toLowerCase()
      }));

      setStep("formato");

      adicionarMensagem(
        "bot",
        "Ótimo. Esse flyer será para qual formato? (Instagram ou WhatsApp)"
      );
    }

    else if (step === "formato") {
      setContexto((prev) => ({
        ...prev,
        formato: textoUsuario.toLowerCase()
      }));

      setStep("campanha");

      adicionarMensagem(
        "bot",
        "Qual campanha você deseja usar?"
      );
    }

    else if (step === "campanha") {
      const payload = {
        produto: contexto.produtoKey,
        subtipo: contexto.subtipo,
        formato: contexto.formato,
        campanha: textoUsuario
      };

      console.log("PAYLOAD FINAL:", payload);

      adicionarMensagem(
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

/**
 * ESTILOS
 */
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
