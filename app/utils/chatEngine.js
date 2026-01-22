import { initialState } from '../data/state';
import { normalizarSubtipoConsorcio } from '../utils/normalizadores';
import { gerarCopySeguroResidencial } from './copy/seguroResidencial';

function garantirState(state) {
  return {
    ...initialState,
    ...state,
    tabela: state.tabela || { colunas: [], linhas: [] }
  };
}

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function chatEngine(message, state = initialState) {
  const texto = normalizarTexto(message);
  let novoState = { ...state };

  switch (state.etapa) {

    /* =========================
       START
    ========================= */
    case 'START':
      novoState.etapa = 'AREA';
      return {
        resposta: 'Olá! Qual área deseja? Seguros, Finanças ou Benefícios?',
        state: garantirState(novoState)
      };

    /* =========================
       AREA
    ========================= */
    case 'AREA':

      if (texto.includes('segur')) {
        novoState.area = 'confi-seguros';
        novoState.produto = 'seguro';
        novoState.etapa = 'TIPO_SEGURO';

        return {
          resposta: 'Perfeito. Qual tipo de seguro? Geral ou Residencial?',
          state: garantirState(novoState)
        };
      }

      if (texto.includes('finan')) {
        novoState.area = 'confi-financas';
        novoState.produto = 'financas';
        novoState.etapa = 'FINANCAS_TIPO';

        return {
          resposta: 'Perfeito. Qual produto? Consórcio, Crédito ou Planejamento?',
          state: garantirState(novoState)
        };
      }

      if (texto.includes('benef')) {
        novoState.area = 'confi-beneficios';
        novoState.produto = 'beneficios';
        novoState.etapa = 'BENEFICIOS_TIPO';

        return {
          resposta: 'Perfeito. Qual benefício? Saúde, Odonto ou Pet?',
          state: garantirState(novoState)
        };
      }

      return {
        resposta: 'Por favor, informe: Seguros, Finanças ou Benefícios.',
        state: garantirState(novoState)
      };

    /* =========================
       SEGUROS
    ========================= */
    case 'TIPO_SEGURO':

      if (texto.includes('resid')) {
        novoState.subproduto = 'residencial';
        novoState.etapa = 'CONFIRMACAO';

        return {
          resposta:
            'Perfeito. Vou preparar o flyer conforme o padrão da Confi Seguros. Posso gerar agora?',
          state: garantirState(novoState)
        };
      }

      if (texto.includes('geral')) {
        novoState.subproduto = 'geral';
        novoState.etapa = 'CONFIRMACAO';

        return {
          resposta:
            'Perfeito. Vou preparar o flyer conforme o padrão da Confi Seguros. Posso gerar agora?',
          state: garantirState(novoState)
        };
      }

      return {
        resposta: 'Informe se o seguro é Geral ou Residencial.',
        state: garantirState(novoState)
      };

    /* =========================
       FINANÇAS — TIPO
    ========================= */
    case 'FINANCAS_TIPO':

      if (texto.includes('consor')) {
        novoState.etapa = 'FINANCAS_SUBTIPO';

        return {
          resposta: 'Qual o tipo de consórcio? Imóvel, Automóvel ou Pesados?',
          state: garantirState(novoState)
        };
      }

      return {
        resposta: 'No momento trabalhamos apenas com Consórcio.',
        state: garantirState(novoState)
      };

    /* =========================
       FINANÇAS — SUBTIPO
    ========================= */
    case 'FINANCAS_SUBTIPO': {
      const subtipo = normalizarSubtipoConsorcio(message);

      if (!subtipo) {
        return {
          resposta: 'Informe: Imóvel, Automóvel ou Pesados.',
          state: garantirState(novoState)
        };
      }

      novoState.subproduto = subtipo;
      novoState.etapa = 'FINANCAS_MESES';

      return {
        resposta: 'Em quantos meses deseja o consórcio?',
        state: garantirState(novoState)
      };
    }

    /* =========================
       FINANÇAS — MESES
    ========================= */
    case 'FINANCAS_MESES': {
      const meses = parseInt(texto);

      if (isNaN(meses) || meses < 12) {
        return {
          resposta: 'Informe um número válido de meses.',
          state: garantirState(novoState)
        };
      }

      novoState.meses = meses;
      novoState.aceitaCampanha = true;
      novoState.etapa = 'FINANCAS_CAMPANHA_TITULO';

      return {
        resposta: 'Qual o destaque principal da campanha?',
        state: garantirState(novoState)
      };
    }

    /* =========================
       FINANÇAS — CAMPANHA
    ========================= */
    case 'FINANCAS_CAMPANHA_TITULO':
      novoState.campanha = {
        textoPrincipal: message
      };

      novoState.etapa = 'FINANCAS_CAMPANHA_AUX';

      return {
        resposta: 'Deseja adicionar um texto complementar? (ou digite "não")',
        state: garantirState(novoState)
      };

    case 'FINANCAS_CAMPANHA_AUX':
      if (!texto.includes('nao')) {
        novoState.campanha.textoAuxiliar = message;
      }

      novoState.aceitaTabela = true;
      novoState.tabela = { colunas: [], linhas: [] };
      novoState.etapa = 'FINANCAS_TABELA_COLUNAS';

      return {
        resposta: 'Informe as colunas da tabela separadas por |',
        state: garantirState(novoState)
      };

    /* =========================
       FINANÇAS — TABELA
    ========================= */
    case 'FINANCAS_TABELA_COLUNAS':
      novoState.tabela.colunas = message
        .split('|')
        .map(c => c.trim())
        .filter(Boolean);

      novoState.etapa = 'FINANCAS_TABELA_LINHAS';

      return {
        resposta: 'Agora informe cada linha da tabela. Digite "ok" quando terminar.',
        state: garantirState(novoState)
      };

    case 'FINANCAS_TABELA_LINHAS':
      if (texto === 'ok') {
        novoState.etapa = 'CONFIRMACAO';

        return {
          resposta: 'Posso gerar o flyer agora?',
          state: garantirState(novoState)
        };
      }

      novoState.tabela.linhas.push(message);

      return {
        resposta: 'Linha adicionada. Digite outra ou "ok".',
        state: garantirState(novoState)
      };

    /* =========================
       CONFIRMAÇÃO FINAL
    ========================= */
    case 'CONFIRMACAO':

      if (texto.includes('sim')) {
        novoState.etapa = 'FINAL';

        if (
          novoState.area === 'confi-seguros' &&
          novoState.subproduto === 'residencial'
        ) {
          const copy = gerarCopySeguroResidencial();
          novoState.textoPrincipal = copy.textoPrincipal;
          novoState.textoComplementar = copy.textoComplementar;
        }

        return {
          resposta: 'Flyer confirmado. Iniciando geração.',
          state: garantirState(novoState)
        };
      }

      return {
        resposta: 'Posso gerar o flyer agora?',
        state: garantirState(novoState)
      };

    /* =========================
       FALLBACK
    ========================= */
    default:
      return {
        resposta: 'Vamos começar novamente.',
        state: garantirState(initialState)
      };
  }
}