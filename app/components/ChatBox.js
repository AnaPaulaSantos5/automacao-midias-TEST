"use client";

import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Olá! Sou o Flyer AI. Me diga que tipo de flyer você deseja criar."
    }
  ]);

  const [step, setStep] = useState("produto");
  const [formData, setFormData] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  function addMessage(from, text) {
    setMessages((prev) => [...prev, { from, text }]);
  }

  function handleUserInput(input) {
    addMessage("user", input);

    switch (step) {
      case "produto":
        addMessage(
          "bot",
          "Perfeito. Qual tipo de consórcio? (Auto, Imóvel ou Serviços)"
        );
        setFormData({ produto: input.toLowerCase() });
        setStep("subtipo");
        break;

      case "subtipo":
        addMessage(
          "bot",
          "Ótimo. Esse flyer será para qual formato? (Instagram ou WhatsApp)"
        );
        setFormData((prev) => ({ ...prev, subtipo: input.toLowerCase() }));
        setStep("canal");
        break;

      case "canal":
        addMessage("bot", "Qual campanha você deseja usar?");
        setFormData((prev) => ({ ...prev, canal: input.toLowerCase() }));
        setStep("campanha");
        break;

      case "campanha":
        setFormData((prev) => ({ ...prev, campanha: input }));
        addMessage(
          "bot",
          "Perfeito! Confira abaixo as informações do flyer antes de gerar."
        );
        setShowConfirm(true);
        break;

      default:
        break;
    }
  }

  function gerarPayloadFinal() {
    return {
      produto: {
        area: "confi-financas",
        tipo: "consorcio",
        subtipo: formData.subtipo
      },
      formato: {
        canal: formData.canal,
        dimensao:
          formData.canal === "instagram" ? "1080x1080" : "1080x1920"
      },
      campanha: {
        titulo: "Consórcio Imobiliário",
        destaque: formData.campanha
      },
      identidadeVisual: {
        paleta: ["#1260c7", "#ffffff", "#000000"],
        marca: "Confi Finanças"
      },
      regrasCriacao: {
        usarTemplateBase: true,
        manterIdentidadeVisual: true,
        evitarElementosNaoPadrao: true
      },
      origem: {
        criadoVia: "chat",
        dataCriacao: new Date().toISOString()
      }
    };
  }

  function confirmarGeracao() {
    const payloadFinal = gerarPayloadFinal();
    console.log("PAYLOAD FINAL PARA GERAÇÃO:", payloadFinal);

    addMessage(
      "bot",
      "Flyer confirmado! Iniciando processo de geração da arte."
    );

    setShowConfirm(false);
  }

  function editarInformacoes() {
    setShowConfirm(false);
    setMessages([
      {
        from: "bot",
        text:
          "Sem problemas. Vamos começar novamente. Que tipo de flyer você deseja criar?"
      }
    ]);
    setFormData({});
    setStep("produto");
  }

  return (
    <div style={{ maxWidth: 500, margin: "20px auto" }}>
      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          minHeight: 300
        }}
      >
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.from === "bot" ? "Flyer AI" : "Você"}:</strong>{" "}
            {msg.text}
          </p>
        ))}
      </div>

      {!showConfirm && step !== "final" && (
        <input
          type="text"
          placeholder="Digite sua resposta..."
          style={{ width: "100%", marginTop: 10 }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim()) {
              handleUserInput(e.target.value);
              e.target.value = "";
            }
          }}
        />
      )}

      {showConfirm && (
        <div style={{ marginTop: 20 }}>
          <h3>Confirmação do Flyer</h3>
          <ul>
            <li>Área: Confi Finanças</li>
            <li>Produto: Consórcio</li>
            <li>Tipo: {formData.subtipo}</li>
            <li>Canal: {formData.canal}</li>
            <li>Campanha: {formData.campanha}</li>
          </ul>

          <button onClick={confirmarGeracao}>
            Gerar flyer
          </button>

          <button
            style={{ marginLeft: 10 }}
            onClick={editarInformacoes}
          >
            Editar informações
          </button>
        </div>
      )}
    </div>
  );
}


