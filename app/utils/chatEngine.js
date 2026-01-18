/**
 * chatEngine.js
 * Chat principal da Confi Flyers
 * Integra fluxos: Consórcio, Seguros, Benefícios
 * Retorna respostas ou prompt final pronto para geração de imagem
 */

import { fluxoConsorcio } from './flows/fluxoConsorcio';
import { fluxoSeguro } from './flows/fluxoSeguro';
import { fluxoBeneficios } from './flows/fluxoBeneficios';
import { buildPromptFromTemplate } from './buildPromptFromTemplate';

export function chatEngine(message, context = {}) {
  const texto = (message || '').trim();

  // 🔴 ESTADO INICIAL
  if (!context.etapa) {
    context.etapa = 'START';
    return responder(
      'Olá! Sou o Flyer AI da Confi.\nMe diga qual flyer você deseja criar: Consórcio, Seguro ou Benefícios.'
    );
  }

  // 🔹 ETAPA DE ESCOLHA DE ÁREA/PRODUTO
  if (context.etapa === 'START') {
    const escolha = texto.toLowerCase();

    if (escolha.includes('consórcio') || escolha.includes('finanças')) {
      context.area = 'CONSORCIO';
      context.etapa = 'START_CONSORCIO';
      return fluxoConsorcio(context, '');
    }

    if (escolha.includes('seguro')) {
      context.area = 'SEGURO';
      context.etapa = 'START_SEGURO';
      return fluxoSeguro(context, '');
    }

    if (escolha.includes('benefício') || escolha.includes('beneficios')) {
      context.area = 'BENEFICIO';
      context.etapa = 'START_BENEFICIO';
      return fluxoBeneficios(context, '');
    }

    return responder(
      'Não entendi. Por favor escolha: Consórcio, Seguro ou Benefícios.'
    );
  }

  // 🔹 REDIRECIONA PARA O FLUXO CORRETO
  switch (context.area) {
    case 'CONSORCIO':
      var resposta = fluxoConsorcio(context, texto);
      break;

    case 'SEGURO':
      var resposta = fluxoSeguro(context, texto);
      break;

    case 'BENEFICIO':
      var resposta = fluxoBeneficios(context, texto);
      break;

    default:
      context.etapa = 'START';
      return responder('Erro no fluxo. Vamos recomeçar. Qual flyer deseja criar?');
  }

  // 🔹 SE FOR GERAR PROMPT
  if (resposta.gerarPrompt) {
    const prompt = buildPromptFromTemplate(resposta.context);
    return { role: 'assistant', content: `Prompt pronto para API:\n${prompt}` };
  }

  return resposta;
}

/* =========================
   HELPERS
========================= */

function responder(content) {
  return {
    role: 'assistant',
    content
  };
}