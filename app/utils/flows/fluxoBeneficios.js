/**
 * fluxoBeneficios.js
 * Fluxo do chat para flyers da Confi Benefícios
 * Produtos: Seguro Saúde, Seguro Odonto, Seguro Pet
 */

export function fluxoBeneficios(context, message) {
  const texto = (message || '').trim();

  switch (context.etapa) {
    case 'START_BENEFICIO':
      context.etapa = 'ESCOLHER_PRODUTO';
      return {
        role: 'assistant',
        content: 'Qual produto deseja criar? Saúde, Odonto ou Pet?'
      };

    case 'ESCOLHER_PRODUTO':
      context.produto = texto.toLowerCase();
      context.etapa = 'BENEFICIOS_ESCOLHA';
      return {
        role: 'assistant',
        content: 'Deseja usar a lista padrão de benefícios ou personalizar? (A = padrão | B = personalizar)'
      };

    case 'BENEFICIOS_ESCOLHA':
      if (texto.toUpperCase() === 'A') {
        context.beneficios = null; // padrão
        context.etapa = 'CONFIRMACAO';
        return { role: 'assistant', content: 'Perfeito. Posso gerar o flyer agora? (Sim / Ajustar)' };
      }
      context.beneficios = [];
      context.etapa = 'BENEFICIOS_INPUT';
      return { role: 'assistant', content: 'Envie cada benefício em uma mensagem ou digite "continuar" quando terminar.' };

    case 'BENEFICIOS_INPUT':
      if (texto.toLowerCase() === 'continuar') {
        context.etapa = 'CONFIRMACAO';
        return { role: 'assistant', content: 'Lista completa. Posso gerar o flyer agora? (Sim / Ajustar)' };
      }
      context.beneficios.push(texto);
      return { role: 'assistant', content: 'Benefício adicionado. Envie outro ou digite "continuar".' };

    case 'CONFIRMACAO':
      if (texto.toLowerCase() === 'sim') {
        return { gerarPrompt: true, context };
      }
      context.etapa = 'START_BENEFICIO';
      return { role: 'assistant', content: 'Ok, vamos ajustar. Qual produto deseja criar?' };

    default:
      context.etapa = 'START_BENEFICIO';
      return { role: 'assistant', content: 'Erro no fluxo. Vamos recomeçar. Qual flyer deseja criar?' };
  }
}