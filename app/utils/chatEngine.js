import { resolverProduto } from './resolverProduto';
import {
  normalizarCanal,
  normalizarFormato,
  normalizarSubtipoConsorcio
} from './normalizador';
import { buildFlyerPayload } from './buildFlyerPayload';

export function chatEngine(message, context) {
  const texto = message.trim();

  switch (context.etapa) {

    case undefined:
      context.etapa = 'PRODUTO';
      return resposta('Olá! Sou o Flyer AI. Me diga qual produto você deseja divulgar.');

    case 'PRODUTO': {
      const produto = resolverProduto(texto);
      if (!produto) return resposta('Não entendi o produto. Pode repetir?');

      context.produto = produto;
      context.etapa = 'CANAL';
      return resposta('Esse flyer será para qual canal? Instagram ou WhatsApp');
    }

    case 'CANAL': {
      const canal = normalizarCanal(texto);
      if (!canal) return resposta('Canal inválido.');

      context.canal = canal;
      context.etapa = 'FORMATO';
      return resposta('Qual formato? (1:1 | 4:5 | 9:16)');
    }

    case 'FORMATO': {
      const formato = normalizarFormato(texto);
      if (!formato) return resposta('Formato inválido.');

      context.formato = formato;

      if (context.produto.key === 'consorcio') {
        context.etapa = 'CONSORCIO_TIPO';
        return resposta('Qual tipo de consórcio? Imóvel, Automóvel ou Pesados');
      }

      context.etapa = 'TEXTO_PRINCIPAL_ESCOLHA';
      return resposta('Deseja escrever a frase principal ou prefere que eu gere? (A/B)');
    }

    case 'CONSORCIO_TIPO': {
      const subtipo = normalizarSubtipoConsorcio(texto);
      if (!subtipo) return resposta('Tipo inválido.');

      context.subtipo = subtipo;
      context.etapa = 'TEXTO_PRINCIPAL_ESCOLHA';
      return resposta('Deseja escrever o texto da campanha ou prefere que eu gere? (A/B)');
    }

    case 'TEXTO_PRINCIPAL_ESCOLHA':
      if (texto.toUpperCase() === 'A') {
        context.etapa = 'TEXTO_PRINCIPAL_INPUT';
        return resposta('Digite o texto principal:');
      }
      context.textoPrincipal = null;
      context.etapa = context.produto.aceitaTabela ? 'MODELO' : 'CONFIRMACAO';
      return resposta('Ok, vou gerar automaticamente.');

    case 'TEXTO_PRINCIPAL_INPUT':
      context.textoPrincipal = texto;
      context.etapa = context.produto.aceitaTabela ? 'MODELO' : 'CONFIRMACAO';
      return resposta('Perfeito.');

    case 'MODELO': {
      const m = texto.toUpperCase();
      if (!['A', 'B'].includes(m)) return resposta('Digite A ou B.');

      context.modelo = m;

      if (m === 'B') {
        context.tabela = { colunas: [], linhas: [] };
        context.etapa = 'TABELA_COLUNAS';
        return resposta('Informe o cabeçalho da tabela (separado por vírgula).');
      }

      context.etapa = 'CONFIRMACAO';
      return resposta('Modelo simples selecionado.');
    }

    case 'TABELA_COLUNAS':
      context.tabela.colunas = texto.split(',').map(v => v.trim());
      context.etapa = 'TABELA_LINHAS';
      return resposta('Informe uma linha da tabela ou digite "continuar".');

    case 'TABELA_LINHAS':
      if (texto.toLowerCase() === 'continuar') {
        context.etapa = 'CONFIRMACAO';
        return resposta('Tudo certo.');
      }
      context.tabela.linhas.push(texto);
      return resposta('Linha adicionada.');

    case 'CONFIRMACAO': {
      const payload = buildFlyerPayload(context);
      context.etapa = 'FINAL';
      return resposta(`PROMPT PARA APROVAÇÃO:\n\n${payload.prompt}`);
    }

    default:
      return resposta('Fluxo encerrado.');
  }
}

function resposta(texto) {
  return { texto };
}