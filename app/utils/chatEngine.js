import perguntasMap from "./perguntasMap";
import { validarFlyer } from "./validadorFlyer";
import { detectarProduto } from "./detectarProduto";
import { CHAT_STEPS } from "./stateMachine";

export function processarMensagem(state, mensagem, flyerConfig) {
  const resposta = {
    texto: "",
    novoState: { ...state }
  };

  // 🔍 Detecta troca de produto a qualquer momento
  const produtoDetectado = detectarProduto(mensagem);
  if (produtoDetectado) {
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

  switch (state.step) {
    case CHAT_STEPS.INICIO:
      resposta.texto = perguntasMap.produto;
      resposta.novoState.step = CHAT_STEPS.PRODUTO;
      break;

    case CHAT_STEPS.CANAL:
      resposta.novoState.canal = mensagem.toLowerCase();
      resposta.texto = perguntasMap.formato;
      resposta.novoState.step = CHAT_STEPS.FORMATO;
      break;

    case CHAT_STEPS.FORMATO:
      resposta.novoState.formato = mensagem;
      resposta.texto = perguntasMap.campanha;
      resposta.novoState.step = CHAT_STEPS.CAMPANHA;
      break;

    case CHAT_STEPS.CAMPANHA:
      resposta.novoState.campanha =
        mensagem.toLowerCase() !== "nenhuma" ? mensagem : null;

      // ✅ FINALIZA IMEDIATAMENTE
      const validacao = validarFlyer(flyerConfig, resposta.novoState);

      resposta.texto = validacao.valido
        ? "Perfeito! Já tenho todas as informações iniciais para criar seu flyer."
        : `Faltam informações: ${validacao.erros.join(", ")}`;

      resposta.novoState.step = CHAT_STEPS.FINAL;
      break;

    case CHAT_STEPS.FINAL:
      resposta.texto =
        "Se quiser, posso criar outro flyer ou gerar a arte deste agora.";
      break;

    default:
      resposta.texto = "Vamos começar. Que tipo de flyer você deseja?";
      resposta.novoState.step = CHAT_STEPS.INICIO;
  }

  return resposta;
}
