import { resolverProduto } from './resolverProduto';
import { normalizarFormato, normalizarCanal } from './normalizador';

export function chatEngine(message, context) {
  const texto = message.trim();

  switch (context.etapa) {
    case null:
      context.etapa = 'START';
      return responder('Olá! Sou o Flyer AI. Me diga que tipo de flyer você deseja criar.');

    case 'START': {
      const produto = resolverProduto(texto);
      if (!produto) return responder('Não entendi o produto. Pode repetir?');

      context.produto = produto;
      context.area = produto.area;
      context.etapa = 'CANAL';
      return responder('Esse flyer será para qual canal? Instagram ou WhatsApp');
    }

    case 'CANAL': {
      const canal = normalizarCanal(texto);
      if (!canal) return responder('Canal inválido. Instagram ou WhatsApp?');

      context.canal = canal;
      context.etapa = 'FORMATO';
      return responder('Qual formato? (1:1 | 4:5 | 9:16)');
    }

    case 'FORMATO': {
      const formato = normalizarFormato(texto);
      if (!formato) return responder('Formato inválido. Use 1:1, 4:5 ou 9:16.');

      context.formato = formato;

      if (context.produto.key === 'consorcio') {
        context.etapa = 'CONSORCIO_TIPO';
        return responder('Qual tipo de consórcio? Imóvel, Automóvel ou Pesados');
      }

      context.etapa = 'TEXTO_PRINCIPAL_ESCOLHA';
      return responder('Deseja escrever a frase principal ou prefere que eu gere? (A/B)');
    }

    case 'CONSORCIO_TIPO':
      context.subproduto = texto;
      context.etapa = 'TEXTO_PRINCIPAL_ESCOLHA';
      return responder('Deseja escrever o texto principal da campanha ou prefere que eu gere? (A/B)');

    case 'TEXTO_PRINCIPAL_ESCOLHA':
      if (texto.toUpperCase() === 'A') {
        context.etapa = 'TEXTO_PRINCIPAL_INPUT';
        return responder('Digite o texto principal:');
      }
      context.textoPrincipal = null;
      context.etapa = context.produto.key === 'consorcio' ? 'MODELO' : 'TEXTO_COMPLEMENTAR';
      return responder('Ok, vou gerar o texto automaticamente.');

    case 'TEXTO_PRINCIPAL_INPUT':
      context.textoPrincipal = texto;
      context.etapa = context.produto.key === 'consorcio' ? 'MODELO' : 'TEXTO_COMPLEMENTAR';
      return responder('Perfeito. Deseja adicionar um texto complementar? (opcional)');

    case 'MODELO':
      context.modelo = texto.toUpperCase();
      if (context.modelo === 'B') {
        context.tabela = { colunas: [], linhas: [] };
        context.etapa = 'TABELA_COLUNAS';
        return responder('Informe o cabeçalho da tabela (separado por vírgula).');
      }
      context.etapa = 'TEXTO_COMPLEMENTAR';
      return responder('Deseja adicionar um texto complementar? (opcional)');

    case 'TABELA_COLUNAS':
      context.tabela.colunas = texto.split(',').map(v => v.trim());
      context.etapa = 'TABELA_LINHAS';
      return responder('Informe os valores da tabela (uma linha por mensagem). Digite "continuar" para finalizar.');

    case 'TABELA_LINHAS':
      if (texto.toLowerCase() === 'continuar') {
        context.etapa = 'TEXTO_COMPLEMENTAR';
        return responder('Deseja adicionar um texto complementar? (opcional)');
      }
      context.tabela.linhas.push(texto);
      return responder('Linha adicionada. Digite outra ou "continuar".');

    case 'TEXTO_COMPLEMENTAR':
      context.textoComplementar = texto || null;
      context.etapa = 'TEXTO_LEGAL';
      return responder('Deseja adicionar um texto legal? (opcional)');

    case 'TEXTO_LEGAL':
      context.textoLegal = texto || null;
      context.etapa = 'CONFIRMACAO';
      return resumo(context);

    default:
      return responder('Estado inválido.');
  }
}

function responder(texto) {
  return { texto };
}

function resumo(context) {
  return {
    texto: `Confira os dados:

Produto: ${context.produto.nomeExibicao}
Canal: ${context.canal}
Formato: ${context.formato}

Posso gerar o prompt do flyer? (Sim / Ajustar)`
  };
}