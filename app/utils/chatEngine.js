import perguntasMap from "./perguntasMap";
import { validarFlyer } from "./validadorFlyer";
import { detectarProduto } from "./detectarProduto";
import { CHAT_STEPS } from "./stateMachine";

export function processarMensagem(state, mensagem, flyerConfig) {
  const resposta = { texto: "", novoState: { ...state } };

  const produtoDetectado = detectarProduto(mensagem);
  if (produtoDetectado) {
    resposta.novoState = {
      ...state,
      ...produtoDetectado,
      step: CHAT_STEPS.CANAL
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
      resposta.novoState.campanha = mensagem !== "nenhuma" ? mensagem : null;

      if (flyerConfig?.comportamento?.possuiTabela) {
        resposta.texto = perguntasMap.tabela;
        resposta.novoState.step = CHAT_STEPS.DETALHES;
      } else {
        resposta.novoState.step = CHAT_STEPS.FINAL;
      }
      break;

    case CHAT_STEPS.FINAL:
      const validacao = validarFlyer(flyerConfig, state);
      resposta.texto = validacao.valido
        ? "Perfeito! Já tenho todas as informações iniciais para criar seu flyer."
        : `Faltam informações: ${validacao.erros.join(", ")}`;
      break;
  }

  return resposta;
}
