import perguntasMap from "./perguntasMap";
import { validarFlyer } from "./validadorFlyer";
import { detectarProduto } from "./detectarProduto";
import { CHAT_STEPS } from "./stateMachine";

/**
 * Processa cada mensagem do usuário e devolve:
 * - texto de resposta
 * - novo estado do chat
 */
export function processarMensagem(state, mensagem, flyerConfig) {
  const resposta = {
    texto: "",
    novoState: { ...state }
  };

  const textoNormalizado = mensagem.toLowerCase().trim();

  // --------------------------------------------------
  // 1️⃣ DETECÇÃO DE PRODUTO (em qualquer momento)
  // --------------------------------------------------
  const produtoDetectado = detectarProduto(textoNormalizado);

  if (produtoDetectado && produtoDetectado.produto !== state.produto) {
    resposta.novoState = {
      produto: produtoDetectado.produto,
      canal: null,
      formato: null,
      campanha: null,
      detalhes: {},
      step: CHAT_STEPS.CANAL
    };

    resposta.texto = perguntasMap.canal;
    return resposta;
  }

  // --------------------------------------------------
  // 2️⃣ FLUXO PRINCIPAL DO CHAT
  // --------------------------------------------------
  switch (state.step) {
    case CHAT_STEPS.INICIO:
      resposta.texto = perguntasMap.produto;
      resposta.novoState.step = CHAT_STEPS.PRODUTO;
      break;

    case CHAT_STEPS.PRODUTO:
      if (!produtoDetectado) {
        resposta.texto = "Não consegui identificar o produto. Pode repetir?";
        break;
      }

      resposta.novoState.produto = produtoDetectado.produto;
      resposta.novoState.step = CHAT_STEPS.CANAL;
      resposta.texto = perguntasMap.canal;
      break;

    case CHAT_STEPS.CANAL:
      resposta.novoState.canal = textoNormalizado.includes("whats")
        ? "whatsapp"
        : "instagram";

      if (resposta.novoState.canal === "instagram") {
        resposta.texto = perguntasMap.formato;
        resposta.novoState.step = CHAT_STEPS.FORMATO;
      } else {
        resposta.novoState.formato = "padrao";
        resposta.texto = perguntasMap.campanha;
        resposta.novoState.step = CHAT_STEPS.CAMPANHA;
      }
      break;

    case CHAT_STEPS.FORMATO:
      resposta.novoState.formato = textoNormalizado;
      resposta.texto = perguntasMap.campanha;
      resposta.novoState.step = CHAT_STEPS.CAMPANHA;
      break;

    case CHAT_STEPS.CAMPANHA:
      resposta.novoState.campanha =
        textoNormalizado === "nenhuma" ? null : mensagem;

      if (flyerConfig?.comportamento?.possuiTabela) {
        resposta.texto = perguntasMap.tabela;
        resposta.novoState.step = CHAT_STEPS.DETALHES;
      } else {
        resposta.novoState.step = CHAT_STEPS.FINAL;
        resposta.texto =
          "Perfeito! Já tenho todas as informações iniciais para criar seu flyer.";
      }
      break;

    case CHAT_STEPS.DETALHES:
      resposta.novoState.detalhes = {
        ...(state.detalhes || {}),
        textoAdicional: mensagem
      };

      resposta.novoState.step = CHAT_STEPS.FINAL;
      resposta.texto =
        "Perfeito! Já tenho todas as informações iniciais para criar seu flyer.";
      break;

    case CHAT_STEPS.FINAL:
      const validacao = validarFlyer(flyerConfig, resposta.novoState);

      resposta.texto = validacao.valido
        ? "Flyer validado com sucesso. Pronto para geração."
        : `Ainda faltam informações: ${validacao.erros.join(", ")}`;
      break;

    default:
      resposta.texto = perguntasMap.produto;
      resposta.novoState.step = CHAT_STEPS.PRODUTO;
      break;
  }

  return resposta;
}

