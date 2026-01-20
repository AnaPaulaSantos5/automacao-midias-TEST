import { initialState } from '../data/state';

/* =========================
   NORMALIZAÇÃO DO STATE
========================= */
function garantirState(state) {
  return {
    etapa: state.etapa || 'START',

    // CONTEXTO PRINCIPAL
    area: state.area ?? null,
    tipoSeguro: state.tipoSeguro ?? null,
    produto: state.produto ?? null,
    subproduto: state.subproduto ?? null,

    // CAMPANHA / TABELA
    campanha:
      state.campanha && typeof state.campanha === 'object'
        ? state.campanha
        : null,

    tabela: state.tabela || { colunas: [], linhas: [] },

    // TEXTO
    textoPrincipal: state.textoPrincipal ?? null,
    textoComplementar: state.textoComplementar ?? null,

    // FORMATO / CANAL
    formato: state.formato ?? null,
    canal: state.canal ?? null,

    // FLAGS
    aceitaTabela: !!state.aceitaTabela,
    aceitaCampanha: !!state.aceitaCampanha
  };
}

/* =========================
   CHAT ENGINE
========================= */
export function chatEngine(message, state = initialState) {
  const texto = message.toLowerCase().trim();
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
      if (texto.includes('seguro')) {
        novoState.area = 'confi-seguros';
        novoState.etapa = 'TIPO_SEGURO';

        return {
          resposta: 'Perfeito. Qual tipo de seguro? Geral ou Residencial?',
          state: garantirState(novoState)
        };
      }

      return {
        resposta: 'Por favor, escolha uma área válida: Seguros, Finanças ou Benefícios.',
        state: garantirState(novoState)
      };

    /* =========================
       TIPO DE SEGURO
    ========================= */
    case 'TIPO_SEGURO':
  if (texto.includes('residencial')) {
    novoState.subproduto = 'residencial'; // 🔴 CAMPO CORRETO
    novoState.produto = 'seguro_residencial';
    novoState.etapa = 'CONFIRMACAO';

    return {
      resposta:
        'Perfeito. Vou preparar o flyer conforme o padrão da Confi Seguros. Posso gerar agora?',
      state: garantirState(novoState)
    };
  }

  if (texto.includes('geral')) {
    novoState.subproduto = 'geral'; // 🔴 CAMPO CORRETO
    novoState.produto = 'seguro_geral';
    novoState.etapa = 'CONFIRMACAO';

    return {
      resposta:
        'Perfeito. Vou preparar o flyer conforme o padrão da Confi Seguros. Posso gerar agora?',
      state: garantirState(novoState)
    };
  }

  return {
    resposta: 'Por favor, informe se o seguro é Geral ou Residencial.',
    state: garantirState(novoState)
  };
      }

      if (texto.includes('geral')) {
        novoState.tipoSeguro = 'geral';
        novoState.produto = 'seguro_geral';
        novoState.etapa = 'CONFIRMACAO';

        return {
          resposta:
            'Perfeito. Vou preparar o flyer conforme o padrão da Confi Seguros. Posso gerar agora?',
          state: garantirState(novoState)
        };
      }

      return {
        resposta: 'Por favor, informe se o seguro é Geral ou Residencial.',
        state: garantirState(novoState)
      };

    /* =========================
       CONFIRMAÇÃO
    ========================= */
    case 'CONFIRMACAO':
      if (
        texto.includes('sim') ||
        texto.includes('pode') ||
        texto.includes('ok') ||
        texto.includes('gerar')
      ) {
        novoState.etapa = 'FINAL';

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
       FINAL
    ========================= */
    case 'FINAL':
      return {
        resposta: 'Flyer já está em processamento.',
        state: garantirState(novoState)
      };

    /* =========================
       FALLBACK
    ========================= */
    default:
      return {
        resposta: 'Vamos recomeçar.',
        state: garantirState(initialState)
      };
  }
}