"use client";

import { useState } from "react";
import { produtos } from "../data/produtos";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Olá! Sou o Flyer AI. Me diga que tipo de flyer você deseja criar." }
  ]);

  const [input, setInput] = useState("");
  const [etapa, setEtapa] = useState(1);
  const [contexto, setContexto] = useState({});

  function adicionarMensagem(from, text) {
    setMessages(prev => [...prev, { from, text }]);
  }

  function detectarProduto(texto) {
    const t = texto.toLowerCase();

    if (t.includes("consórcio") || t.includes("consorcio")) return "consorcio";
    if (t.includes("residencial")) return "seguro_residencial";
    if (t.includes("auto")) return "seguro_auto";
    if (t.includes("saúde") || t.includes("saude")) return "plano_saude";
    if (t.includes("odonto")) return "seguro_odonto";
    if (t.includes("pet")) return "seguro_pet";

    return null;
  }

  function detectarSubtipo(produtoKey, texto) {
    const subtipos = produtos[produtoKey]?.subtipos;
    if (!subtipos) return null;

    const t = texto.toLowerCase();

    for (const key of Object.keys(subtipos)) {
      if (t.includes(key)) return key;
    }

    return null;
  }

  function handleSend() {
    if (!input.trim()) return;

    const userText = input;
    adicionarMensagem("user", userText);
    setInput("");

    /* =====================
       ETAPA 1 – PRODUTO
    ===================== */
    if (etapa === 1) {
      const produtoKey = detectarProduto(userText);

      if (!produtoKey) {
        adicionarMensagem(
          "bot",
          "Certo. Para eu te ajudar melhor, qual tipo de flyer você deseja criar? (Consórcio, Seguro, Saúde, Odonto ou Pet)"
        );
        return;
      }

      const produto = produtos[produtoKey];

      setContexto({ produtoKey });
      setEtapa(2);

      const subtipos = Object.values(produto.subtipos)
        .map(s => s.nomeExibicao)
        .join(", ");

      adicionarMensagem(
        "bot",
        `Perfeito! Qual tipo de ${produto.nomeExibicao}? (${subtipos})`
      );
      return;
    }

    /* =====================
       ETAPA 2 – SUBTIPO
    ===================== */
    if (etapa === 2) {
      const { produtoKey } = contexto;
      const subtipoKey = detectarSubtipo(produtoKey, userText);

      if (!subtipoKey) {
        adicionarMensagem("bot", "Não entendi. Pode informar o tipo corretamente?");
        return;
      }

      setContexto(prev => ({ ...prev, subtipoKey }));
      setEtapa(3);

      adicionarMensagem(
        "bot",
        "Ótimo. Esse flyer será para qual formato? (Instagram ou WhatsApp)"
      );
      return;
    }

    /* =====================
       ETAPA 3 – FORMATO
    ===================== */
    if (etapa === 3) {
      const formato = userText.toLowerCase();

      if (!["instagram", "whatsapp"].includes(formato)) {
        adicionarMensagem("bot", "Formato inválido. Use Instagram ou WhatsApp.");
        return;
      }

      setContexto(prev => ({ ...prev, formato }));
      setEtapa(4);

      adicionarMensagem(
        "bot",
        "Qual campanha você deseja usar?"
      );
      return;
    }

    /* =====================
       ETAPA 4 – CAMPANHA
    ===================== */
    if (etapa === 4) {
      setContexto(prev => ({ ...prev, campanha: userText }));
      setEtapa(5);

      adicionarMensagem(
        "bot",
        "Perfeito! Já tenho todas as informações iniciais para criar seu flyer."
      );

      console.log("CONTEXTO FINAL:", contexto);
      return;
    }
  }

  return (
    <div style={{ maxWidth: 500, marginTop: 20 }}>
      <div style={{ border: "1px solid #ccc", padding: 10, minHeight: 300 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.from === "bot" ? "left" : "right" }}>
            <p><strong>{m.from === "bot" ? "Flyer AI" : "Você"}:</strong> {m.text}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", marginTop: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ flex: 1 }}
          placeholder="Digite aqui..."
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
}
