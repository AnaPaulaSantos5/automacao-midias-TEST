import { resolverProduto } from './resolverProduto';
import {
  normalizarCanal,
  normalizarFormato,
  normalizarSubtipoConsorcio
} from './normalizador';

export function chatEngine(message, context = {}) {
  const texto = (message || '').trim();

  // 🔴 GARANTIA DE ESTADO INICIAL
  if (!context.etapa) {
    context.etapa = 'START';
    return responder(
      'Olá! Sou o Flyer AI da Confi.\nMe diga qual flyer você deseja criar.'
    );
  }

  switch (context.etapa) {
    /* =========================
       START
    ========================= */
    case 'START': {
      const produto = resolverProduto(texto);

      if (!produto) {
        return responder(
          'Não entendi o produto. Pode me dizer, por exemplo: consórcio, seguro residencial, plano de saúde.'
        );
      }

      context.produto = produto;
      context.area = produto.area;
      context.etapa = 'CANAL';

      return responder(
        `Perfeito. O flyer de ${produto.nomeExibicao} será para qual canal? Instagram ou WhatsApp?`
      );
    }

    /* =========================
       CANAL
    ========================= */
    case 'CANAL': {
      const canal = normalizarCanal(texto);
      if (!canal) {
        return responder('Canal inválido. Use Instagram ou WhatsApp.');
      }

      context.canal = canal;
      context.etapa = 'FORMATO';

      return responder('Qual formato? (1:1 | 4:5 | 9:16)');
    }

    /* =========================
       FORMATO
    ========================= */
    case 'FORMATO': {
      const formato = normalizarFormato(texto);
      if (!formato) {
        return responder('Formato inválido. Use 1:1, 4:5 ou 9:16.');
      }

      context.formato = formato;

      if (context.produto.key === 'consorcio') {
        context.etapa = 'CONSORCIO_SUBTIPO';
        return responder('Qual tipo de consórcio? Imóvel, Automóvel ou Pesados');
      }

      context.etapa = 'TEXTO_PRINCIPAL_ESCOLHA';
      return responder(
        'Deseja escrever a frase principal ou prefere que eu gere? (A = escrever | B = gerar)'
      );
    }

    /* =========================
       CONSÓRCIO – SUBTIPO
    ========================= */
    case 'CONSORCIO_SUBTIPO': {
      const subtipo = normalizarSubtipoConsorcio(texto);

      if (!subtipo) {
        return responder(
          'Tipo inválido. Use: Imóvel, Automóvel ou Pesados.'
        );
      }

      context.subproduto = subtipo;
      context.etapa = 'TEXTO_PRINCIPAL_ESCOLHA';

      return responder(
        'Deseja escrever o texto principal da campanha ou prefere que eu gere? (A = escrever | B = gerar)'
      );
    }

    /* =========================
       TEXTO PRINCIPAL – ESCOLHA
    ========================= */
    case 'TEXTO_PRINCIPAL_ESCOLHA': {
      if (texto.toUpperCase() === 'A') {
        context.etapa = 'TEXTO_PRINCIPAL_INPUT';
        return responder('Digite o texto principal da campanha:');
      }

      context.textoPrincipal = null;
      context.etapa =
        context.produto.key === 'consorcio' ? 'MODELO' : 'TEXTO_COMPLEMENTAR';

      return responder('Perfeito. Vou gerar o texto automaticamente.');
    }

    /* =========================
       TEXTO PRINCIPAL – INPUT
    ========================= */
    case 'TEXTO_PRINCIPAL_INPUT': {
      context.textoPrincipal = texto;
      context.etapa =
        context.produto.key === 'consorcio' ? 'MODELO' : 'TEXTO_COMPLEMENTAR';

      return responder(
        'Texto salvo. Deseja adicionar um texto complementar? (opcional)'
      );
    }

    /* =========================
       CONSÓRCIO – MODELO
    ========================= */
    case 'MODELO': {
      context.modelo = texto.toUpperCase();

      if (context.modelo === 'B') {
        context.tabela = { colunas: [], linhas: [] };
        context.etapa = 'TABELA_COLUNAS';
        return responder(
          'Informe o cabeçalho da tabela (separado por vírgula).'
        );
      }

      context.etapa = 'TEXTO_COMPLEMENTAR';
      return responder('Deseja adicionar um texto complementar? (opcional)');
    }

    /* =========================
       TABELA – COLUNAS
    ========================= */
    case 'TABELA_COLUNAS': {
      context.tabela.colunas = texto.split(',').map(v => v.trim());
      context.etapa = 'TABELA_LINHAS';

      return responder(
        'Agora informe os valores da tabela. Envie uma linha por mensagem ou digite "continuar".'
      );
    }

    /* =========================
       TABELA – LINHAS
    ========================= */
    case 'TABELA_LINHAS': {
      if (texto.toLowerCase() === 'continuar') {
        context.etapa = 'TEXTO_COMPLEMENTAR';
        return responder('Deseja adicionar um texto complementar? (opcional)');
      }

      context.tabela.linhas.push(texto);
      return responder('Linha adicionada. Envie outra ou digite "continuar".');
    }

    /* =========================
       TEXTO COMPLEMENTAR
    ========================= */
    case 'TEXTO_COMPLEMENTAR': {
      context.textoComplementar = texto || null;
      context.etapa = 'CONFIRMACAO';
      return resumo(context);
    }

    /* =========================
       CONFIRMAÇÃO
    ========================= */
    case 'CONFIRMACAO': {
      if (texto.toLowerCase().includes('sim')) {
        return {
          gerarPrompt: true,
          context
        };
      }

      context.etapa = 'START';
      return responder('Ok. Vamos ajustar. Me diga novamente o produto.');
    }

    default:
      context.etapa = 'START';
      return responder(
        'Houve um problema no fluxo. Vamos recomeçar. Qual flyer deseja criar?'
      );
  }
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

function resumo(context) {
  return {
    role: 'assistant',
    content: `Perfeito! Confira os dados:

Produto: ${context.produto.nomeExibicao}
Canal: ${context.canal}
Formato: ${context.formato}

Posso gerar o prompt do flyer? (Sim / Ajustar)`
  };
}