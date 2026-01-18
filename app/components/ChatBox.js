"use client";
import { useState } from "react";
import { chatEngine } from "@/app/utils/chatEngine";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [state, setState] = useState({ etapa: "inicio" });

  function enviar() {
    if (!input.trim()) return;

    const res = chatEngine(input, state);

    setMessages(prev => [
      ...prev,
      { from: "user", text: input },
      { from: "bot", text: res.reply },
      ...(res.prompt ? [{ from: "bot", text: res.prompt }] : [])
    ]);

    setState(res.state);
    setInput("");
  }

  return (
    <div>
      <div>
        {messages.map((m, i) => (
          <p key={i}><b>{m.from}:</b> {m.text}</p>
        ))}
      </div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && enviar()}
      />
      <button onClick={enviar}>Enviar</button>
    </div>
  );
}