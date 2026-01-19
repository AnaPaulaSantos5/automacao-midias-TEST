import { resolverProduto } from './resolverProduto';
import {
  normalizarFormato,
  normalizarSubtipoConsorcio
} from './normalizador';

export function chatEngine(message, context = {}) {
  const texto = (message || '').trim();

  // ===== INICIALIZAÇÃO =====
  if (!context.etapa) {
    context.etapa = 'ESCOLHA_PRODUTO';
    return resposta(
      'Olá! Sou o Flyer AI da Confi.\nQual flyer deseja criar: Consórcio, Seguro ou Benefícios?',
      context
    );
  }

  // ===== FLUXO =====
  switch (context.etapa) {
    /* =========================
       ESCOLHA DO PRODUTO
    ========================= */
    case 'ESCOLHA_PRODUTO': {
      const produto = resolverProduto(texto);

      if (!produto) {
        return resposta(
          'Não entendi. Você pode escolher entre: Consórcio, Seguro ou Benefícios.',
          context
        );
      }

      context.produto = produto;
      context.etapa =
        produto.key === 'consorcio'
          ? 'CONSORCIO_SUBTIPO'
          : produto.area === 'confi-seguros'
          ? 'SEGURO_TIPO'
          : 'BENEFICIOS_TIPO';

      return resposta(
        produto.key === 'consorcio'
          ? 'Qual tipo de consórcio? Imóvel, Automóvel ou Pesados?'
          : produto.area === 'confi-seguros'
          ? 'Qual seguro deseja criar? Residencial ou Auto?'
          : 'Qual produto deseja criar? Saúde, Odonto ou Pet?',
        context
      );
    }

    /* =========================
       CONSÓRCIO
    ========================= */
    case 'CONSORCIO_SUBTIPO': {
      const subtipo = normalizarSubtipoConsorcio(texto);
      if (!subtipo) {
        return resposta(
          'Tipo inválido. Use: Imóvel, Automóvel ou Pesados.',
          context
        );
      }

      context.subtipo = subtipo;
      context.etapa = 'CONSORCIO_MESES';

      return resposta(
        'Quantos meses terá o grupo? (Ex: 200)',
        context
      );
    }

    case 'CONSORCIO_MESES': {
      const meses = texto.replace(/\D/g, '');
      if (!meses) {
        return resposta('Informe apenas o número de meses.', context);
      }

      context.meses = meses;
      context.etapa = 'CONSORCIO_CAMPANHA';

      return resposta(
        'Qual campanha deseja destacar? Ex: Parcelas reduzidas, taxa zero…',
        context
      );
    }

    case 'CONSORCIO_CAMPANHA': {
      context.textoPrincipal = texto;
      context.etapa = 'CONSORCIO_TABELA_COLUNAS';

      return resposta(
        'Informe os títulos das colunas da tabela ou digite "padrão".',
        context
      );
    }

    case 'CONSORCIO_TABELA_COLUNAS': {
      context.tabela = {
        colunas:
          texto.toLowerCase() === 'padrão'
            ? ['Crédito', 'Taxa Adm', 'Parcela PF', 'Parcela PJ']
            : texto.split(',').map(v => v.trim()),
        linhas: []
      };

      context.etapa = 'CONSORCIO_TABELA_LINHAS';

      return resposta(
        'Envie as linhas da tabela uma por mensagem ou digite "continuar".',
        context
      );
    }

    case 'CONSORCIO_TABELA_LINHAS': {
      if (texto.toLowerCase() === 'continuar') {
        context.etapa = 'TEXTO_COMPLEMENTAR';
        return resposta(
          'Deseja adicionar um texto complementar? (opcional)',
          context
        );
      }

      context.tabela.linhas.push(texto);
      return resposta('Linha adicionada.', context);
    }

    /* =========================
       TEXTO COMPLEMENTAR
    ========================= */
    case 'TEXTO_COMPLEMENTAR': {
      context.textoComplementar =
        texto.toLowerCase() === 'não' ? null : texto;

      context.etapa = 'CONFIRMACAO';

      return resposta(resumo(context), context);
    }

    /* =========================
       CONFIRMAÇÃO
    ========================= */
    case 'CONFIRMACAO': {
      if (texto.toLowerCase().includes('sim')) {
        return {
          role: 'assistant',
          content: 'Prompt pronto para API.',
          gerarPrompt: true,
          payload: context
        };
      }

      context.etapa = 'ESCOLHA_PRODUTO';
      return resposta('Ok, vamos ajustar. Qual flyer deseja criar?', context);
    }

    default:
      context.etapa = 'ESCOLHA_PRODUTO';
      return resposta(
        'Ocorreu um erro. Vamos recomeçar.',
        context
      );
  }
}

/* =========================
   HELPERS
========================= */
function resposta(content, context) {
  return { role: 'assistant', content, context };
}

function resumo(c) {
  return `
Produto: ${c.produto.nomeExibicao}
Tipo: ${c.subtipo || '-'}
Meses: ${c.meses || '-'}
Texto principal: ${c.textoPrincipal}
Texto complementar: ${c.textoComplementar || 'Não informado'}

Posso gerar o prompt do flyer? (Sim / Ajustar)
`.trim();
}