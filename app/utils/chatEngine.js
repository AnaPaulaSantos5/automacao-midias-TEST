import perguntasMap from "./perguntasMap";
import { validarFlyer } from "./validadorFlyer";
import { detectarProduto } from "./detectarProduto";
import { CHAT_STEPS } from "./stateMachine";

/**
 * Motor central do chat
 * Recebe estado atual, mensagem do usuário e flyerConfig (flyersBase)
 */
export function processarMensagem(state, mensagem, flyerConfig) {
  const textoUsuario = mensagem.trim().toLowerCase();

  const resposta = {
    texto: "",
    novoState: { ...state }
  };

  // =========================
  // 🔁 DETECÇÃO GLOBAL DE PRODUTO
  // =========================
  const produtoDetectado = detectarProduto(textoUsuario);

  if (
    produtoDetectado &&
    produtoDetectado.tipo !== state.tipo
  ) {
    resposta.novoState = {
      step: CHAT_STEPS.CANAL,
      ...produtoDetectado,
      canal: null,
      formato: null,
      campanha: null,
      detalhes: {}
    };

    resposta.texto = perguntasMap.canal;
    return resposta;
  }

  // =========================
  // FLUXO POR ETAPA
  // =========================
  switch (state.step) {
    // -------------------------
    case CHAT_STEPS.INICIO:
      resposta.texto = perguntasMap.produto;
      resposta.novoState.step = CHAT_STEPS.PRODUTO;
      break;

    // -------------------------
    case CHAT_STEPS.PRODUTO:
      if (!produtoDetectado) {
        resposta.texto = perguntasMap.produtoErro;
        break;
      }

      resposta.novoState = {
        ...state,
        ...produtoDetectado,
        step: CHAT_STEPS.CANAL
      };

      resposta.texto = perguntasMap.canal;
      break;

    // -------------------------
    case CHAT_STEPS.CANAL:
      if (!["instagram", "whatsapp"].includes(textoUsuario)) {
        resposta.texto = perguntasMap.canalErro;
        break;
      }

      resposta.novoState.canal = textoUsuario;

      if (textoUsuario === "instagram") {
        resposta.texto = perguntasMap.formato;
        resposta.novoState.step = CHAT_STEPS.FORMATO;
      } else {
        resposta.novoState.formato = "padrao";
        resposta.texto = perguntasMap.campanha;
        resposta.novoState.step = CHAT_STEPS.CAMPANHA;
      }
      break;

    // -------------------------
    case CHAT_STEPS.FORMATO:
      resposta.novoState.formato = textoUsuario;
      resposta.texto = perguntasMap.campanha;
      resposta.novoState.step = CHAT_STEPS.CAMPANHA;
      break;

    // -------------------------
    case CHAT_STEPS.CAMPANHA:
      resposta.novoState.campanha =
        textoUsuario === "nenhuma" ? null : mensagem;

      if (flyerConfig?.comportamento?.possuiTabela) {
        resposta.texto = perguntasMap.tabela;
        resposta.novoState.step = CHAT_STEPS.DETALHES;
      } else {
        resposta.novoState.step = CHAT_STEPS.FINAL;
        const validacao = validarFlyer(flyerConfig, resposta.novoState);
        resposta.texto = validacao.valido
          ? perguntasMap.final
          : `Faltam informações: ${validacao.erros.join(", ")}`;
      }
      break;

    // -------------------------
    case CHAT_STEPS.DETALHES:
      resposta.novoState.detalhes = {
        ...state.detalhes,
        observacoes: mensagem
      };

      resposta.novoState.step = CHAT_STEPS.FINAL;

      const validacaoFinal = validarFlyer(
        flyerConfig,
        resposta.novoState
      );

      resposta.texto = validacaoFinal.valido
        ? perguntasMap.final
        : `Faltam informações: ${validacaoFinal.erros.join(", ")}`;
      break;

    // -------------------------
    case CHAT_STEPS.FINAL:
      resposta.texto =
        "Se quiser criar outro flyer, é só me dizer o produto.";
      resposta.novoState.step = CHAT_STEPS.INICIO;
      break;

    // -------------------------
    default:
      resposta.texto = perguntasMap.fallback;
      resposta.novoState.step = CHAT_STEPS.INICIO;
      break;
  }

  return resposta;
}


