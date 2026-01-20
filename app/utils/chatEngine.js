import { initialState } from '../data/state';

function garantirState(state) {
  return {
    etapa: state.etapa || 'START',
    produto: state.produto ?? null,
    area: state.area ?? null,
    subproduto: state.subproduto ?? null,
    meses: state.meses ?? null,
    campanha:
  state.campanha && typeof state.campanha === 'object'
    ? state.campanha
    : null,
    tabela: state.tabela || { colunas: [], linhas: [] },
    textoPrincipal: state.textoPrincipal ?? null,
    textoComplementar: state.textoComplementar ?? null,
    formato: state.formato ?? null,
    canal: state.canal ?? null,
    aceitaTabela: !!state.aceitaTabela,
    aceitaCampanha: !!state.aceitaCampanha
  };
}

export function chatEngine(message, state = initialState) {
  const texto = message.toLowerCase().trim();
  let novoState = { ...state };

  switch (state.etapa) {
    case 'START':
      novoState.etapa = 'AREA';
      return {
        resposta: 'Olá! Qual área deseja? Seguros, Finanças ou Benefícios?',
        state: garantirState(novoState)
      };

    case 'AREA':
      if (texto.includes('seguros')) {
        novoState.area = 'confi-seguros';
        novoState.etapa = 'TIPO_SEGURO';
        return {
          resposta: 'Perfeito. Qual tipo de seguro? Geral ou Residencial?',
          state: garantirState(novoState)
        };
      }
      break;

    case 'TIPO_SEGURO':
      if (texto.includes('residencial')) {
        novoState.produto = 'seguro_residencial';
        novoState.etapa = 'CONFIRMACAO';
        return {
          resposta: 'Perfeito. Vou preparar o flyer conforme o padrão da Confi Seguros. Posso gerar agora?',
          state: garantirState(novoState)
        };
      }
      break;

    case 'CONFIRMACAO':
      if (texto.includes('pode') || texto.includes('ok') || texto.includes('sim')) {
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

    case 'FINAL':
      return {
        resposta: 'Flyer já está em processamento.',
        state: garantirState(novoState)
      };

    default:
      return {
        resposta: 'Vamos recomeçar.',
        state: garantirState(initialState)
      };
  }

  return {
    resposta: 'Não entendi. Pode reformular?',
    state: garantirState(novoState)
  };
}