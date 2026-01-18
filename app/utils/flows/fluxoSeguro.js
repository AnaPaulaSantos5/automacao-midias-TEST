/**
 * fluxoSeguro.js
 * Fluxo do chat para criação de flyers de Seguros (Confi Seguros)
 * Produtos: Seguro Residencial, Auto, Vida…
 */

export function fluxoSeguro(context, message) {
  const texto = (message || '').trim();

  switch (context.etapa) {
    case 'START_SEGURO':
      context.etapa = 'ESCOLHER_PRODUTO';
      return {
        role: 'assistant',
        content: 'Qual seguro deseja criar? Residencial, Auto ou Vida?'
      };

    case 'ESCOLHER_PRODUTO':
      context.produto = texto.toLowerCase();
      context.etapa = 'TEXTO_PRINCIPAL_ESCOLHA';
      return {
        role: 'assistant',
        content: 'Deseja escrever a frase principal ou prefere que eu gere automaticamente? (A = escrever | B = gerar)'
      };

    case 'TEXTO_PRINCIPAL_ESCOLHA':
      if (texto.toUpperCase() === 'A') {
        context.etapa = 'TEXTO_PRINCIPAL_INPUT';
        return { role: 'assistant', content: 'Digite o texto principal da campanha:' };
      }
      context.textoPrincipal = null;
      context.etapa = 'CONFIRMACAO';
      return { role: 'assistant', content: 'Perfeito. Vou gerar o texto automaticamente.' };

    case 'TEXTO_PRINCIPAL_INPUT':
      context.textoPrincipal = texto;
      context.etapa = 'CONFIRMACAO';
      return { role: 'assistant', content: 'Texto salvo. Posso gerar o flyer agora? (Sim / Ajustar)' };

    case 'CONFIRMACAO':
      if (texto.toLowerCase() === 'sim') {
        return { gerarPrompt: true, context };
      }
      context.etapa = 'START_SEGURO';
      return { role: 'assistant', content: 'Ok, vamos ajustar. Qual seguro deseja criar?' };

    default:
      context.etapa = 'START_SEGURO';
      return { role: 'assistant', content: 'Erro no fluxo. Vamos recomeçar. Qual flyer deseja criar?' };
  }
}