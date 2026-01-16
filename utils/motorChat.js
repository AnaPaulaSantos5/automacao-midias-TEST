import { identificarProduto } from "./identificarProduto";

export function proximaPergunta(texto, estadoAtual) {
  const novoProduto = identificarProduto(texto);

  // 🔁 Se mudar de produto, reset automático
  if (novoProduto && novoProduto !== estadoAtual.produto) {
    return {
      mensagem: "Perfeito. Esse flyer será para qual canal? (Instagram ou WhatsApp)",
      novoEstado: {
        produto: novoProduto,
        canal: null,
        formato: null,
        campanha: null,
        etapa: "canal"
      }
    };
  }

  // --------------------
  // FLUXO NORMAL
  // --------------------

  if (estadoAtual.etapa === "produto") {
    if (!novoProduto) {
      return {
        mensagem: "Não consegui identificar o produto. Pode repetir?",
        novoEstado: estadoAtual
      };
    }

    return {
      mensagem: "Esse flyer será para qual canal? (Instagram ou WhatsApp)",
      novoEstado: { ...estadoAtual, produto: novoProduto, etapa: "canal" }
    };
  }

  if (estadoAtual.etapa === "canal") {
    const canal = texto.toLowerCase().includes("whats") ? "whatsapp" : "instagram";

    return {
      mensagem:
        canal === "instagram"
          ? "Qual formato você deseja? Feed (1:1) | Feed Vertical (4:5) | Stories (9:16)"
          : "Formato padrão do WhatsApp será utilizado.",
      novoEstado: {
        ...estadoAtual,
        canal,
        etapa: canal === "instagram" ? "formato" : "campanha",
        formato: canal === "whatsapp" ? "padrao" : null
      }
    };
  }

  if (estadoAtual.etapa === "formato") {
    return {
      mensagem: "Deseja usar alguma campanha? Se sim, qual?",
      novoEstado: { ...estadoAtual, formato: texto, etapa: "campanha" }
    };
  }

  if (estadoAtual.etapa === "campanha") {
    return {
      mensagem:
        "Perfeito! Já tenho todas as informações iniciais para criar seu flyer.",
      novoEstado: { ...estadoAtual, campanha: texto, etapa: "finalizado" }
    };
  }

  return { mensagem: null, novoEstado: estadoAtual };
}
