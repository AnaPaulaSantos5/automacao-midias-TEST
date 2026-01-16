import perguntasMap from "./perguntasMap";
import { validarFlyer } from "./validadorFlyer";
import { detectarProduto } from "./detectarProduto";
import { CHAT_STEPS } from "./stateMachine";

/* =========================
   NORMALIZADOR DE FORMATO
========================= */
function normalizarFormato(texto) {
  if (!texto) return null;

  const t = texto.toLowerCase().replace(/\s/g, "");

  if (
    t.includes("9:16") ||
    t.includes("9x16") ||
    t.includes("story") ||
    t.includes("stories") ||
    t.includes("vertical")
  ) {
    return "story";
  }

  if (t.includes("4:5")) {
    return "feedVertical";
  }

  if (t.includes("1:1") || t.includes("feed")) {
    return "feed";
  }

  return null;
}

/* =========================
   CHAT ENGINE
========================= */
export function processarMensagem(state, mensagem, flyerConfig) {
  const resposta = {
    texto: "",
    novoState: { ...state }
  };

  const texto = mensagem.toLowerCase();

  /* =========================
     DETECÇÃO DE PRODUTO
  ========================= */
  const produtoDetectado = detectarProduto(texto);

  if (produtoDetectado) {
    resposta.novoState = {
      produto: produtoDetectado.produto,
      subtipo: produtoDetectado.subtipo || null,
      canal: null,
      formato: null,
      campanha: null,
      step: CHAT_STEPS.CANAL
    };

    resposta.texto = perguntasMap.canal;
    return resposta;
  }

  /* =========================
     FLUXO POR ETAPA
  ========================= */
  switch (state.step) {
    case CHAT_STEPS.INICIO:
      resposta.texto = perguntasMap.produto;
      resposta.novoState.step = CHAT_STEPS.PRODUTO;
      break;

    case CHAT_STEPS.CANAL: {
      if (!texto.includes("insta") && !texto.includes("whats")) {
        resposta.texto = "Canal inválido. Escolha Instagram ou WhatsApp.";
        return resposta;
      }

      const canal = texto.includes("whats") ? "whatsapp" : "instagram";

      resposta.novoState.canal = canal;
      resposta.novoState.step =
        canal === "instagram" ? CHAT_STEPS.FORMATO : CHAT_STEPS.CAMPANHA;

      resposta.texto =
        canal === "instagram"
          ? perguntasMap.formato
          : perguntasMap.campanha;

      break;
    }

    case CHAT_STEPS.FORMATO: {
      const formatoNormalizado = normalizarFormato(texto);

      if (!formatoNormalizado) {
        resposta.texto =
          "Formato inválido. Use 1:1 (Feed), 4:5 (Feed Vertical) ou 9:16 (Stories).";
        return resposta;
      }

      resposta.novoState.formato = formatoNormalizado;
      resposta.novoState.step = CHAT_STEPS.CAMPANHA;
      resposta.texto = perguntasMap.campanha;
      break;
    }

    case CHAT_STEPS.CAMPANHA:
      resposta.novoState.campanha =
        texto === "nenhuma" || texto === "não" ? null : mensagem;

      resposta.novoState.step = CHAT_STEPS.FINAL;
      break;

    case CHAT_STEPS.FINAL: {
      const validacao = validarFlyer(flyerConfig, resposta.novoState);

      resposta.texto = validacao.valido
        ? "Perfeito! Já tenho todas as informações iniciais para criar seu flyer."
        : `Faltam informações: ${validacao.erros.join(", ")}`;

      break;
    }

    default:
      resposta.texto = perguntasMap.produto;
      resposta.novoState.step = CHAT_STEPS.PRODUTO;
  }

  return resposta;
}