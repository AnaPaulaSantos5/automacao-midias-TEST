import { initialState } from '../data/state';
import { gerarCopySeguroResidencial } from './copy/seguroResidencial';

function garantirState(state) {
  return {
    ...initialState,
    ...state
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
      if (texto.includes('seguro')) {
        novoState.area = 'confi-seguros';
        novoState.etapa = 'TIPO_SEGURO';
        return {
          resposta: 'Perfeito. Qual tipo de seguro? Geral ou Residencial?',
          state: garantirState(novoState)
        };
      }
      return {
        resposta: 'Por favor, informe: Seguros, Finanças ou Benefícios.',
        state: garantirState(novoState)
      };

    case 'TIPO_SEGURO':
  if (texto.includes('residencial')) {
    novoState.area = 'confi-seguros';
    novoState.produto = 'seguro';
    novoState.subproduto = 'residencial';
    novoState.etapa = 'CONFIRMACAO';

    return {
      resposta:
        'Perfeito. Vou preparar o flyer conforme o padrão da Confi Seguros. Posso gerar agora?',
      state: garantirState(novoState)
    };
  }

  if (texto.includes('geral')) {
    novoState.area = 'confi-seguros';
    novoState.produto = 'seguro';
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

    case 'CONFIRMACAO':
  if (texto.includes('sim')) {
    novoState.etapa = 'FINAL';

    if (novoState.area === 'confi-seguros' && novoState.subproduto === 'residencial') {
      const copy = gerarCopySeguroResidencial();
      novoState.textoPrincipal = copy.textoPrincipal;
      novoState.textoComplementar = copy.textoComplementar;
    }

    return {
      resposta: 'Flyer confirmado. Iniciando geração.',
      state: garantirState(novoState)
    };

    default:
      return {
        resposta: 'Vamos começar novamente.',
        state: garantirState(initialState)
      };
  }
}
