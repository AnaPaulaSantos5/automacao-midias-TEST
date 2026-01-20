// app/utils/chatEngine.js
import { initialState } from '../data/state';

export function chatEngine(message, state = initialState) {
  const texto = (message || '').toLowerCase().trim();
  const newState = { ...state };

  /* ================= START ================= */
  if (state.etapa === 'START') {
    newState.etapa = 'ESCOLHER_AREA';
    return {
      resposta: 'Olá! Qual área deseja? Seguros, Finanças ou Benefícios?',
      state: newState
    };
  }

  /* ================= ÁREA ================= */
  if (state.etapa === 'ESCOLHER_AREA') {
    if (texto.includes('seguro')) {
      newState.area = 'confi-seguros';
      newState.etapa = 'ESCOLHER_SEGURO';
      return { resposta: 'Qual tipo de seguro? Geral ou Residencial?', state: newState };
    }

    if (texto.includes('finan') || texto.includes('consor')) {
      newState.area = 'confi-financas';
      newState.etapa = 'ESCOLHER_CONSORCIO';
      return { resposta: 'Qual tipo de consórcio? Imóvel, Automóvel ou Pesados?', state: newState };
    }

    if (texto.includes('benef')) {
      newState.area = 'confi-beneficios';
      newState.etapa = 'ESCOLHER_BENEFICIO';
      return { resposta: 'Qual produto deseja? Saúde, Odonto ou Pet?', state: newState };
    }

    return { resposta: 'Não entendi. Escolha Seguros, Finanças ou Benefícios.', state };
  }

  /* ================= SEGUROS ================= */
  if (state.etapa === 'ESCOLHER_SEGURO') {
    if (texto.includes('resid')) {
      newState.subproduto = 'residencial';
      newState.etapa = 'FINAL';
      return {
        resposta: 'Perfeito! Vou preparar o flyer conforme o padrão da Confi Seguros.',
        state: newState
      };
    }

    if (texto.includes('geral')) {
      newState.subproduto = 'geral';
      newState.etapa = 'FINAL';
      return {
        resposta: 'Perfeito! Vou preparar o flyer conforme o padrão da Confi Seguros.',
        state: newState
      };
    }

    return { resposta: 'Escolha Geral ou Residencial.', state };
  }

  /* ================= BENEFÍCIOS ================= */
  if (state.etapa === 'ESCOLHER_BENEFICIO') {
    if (['odonto', 'saúde', 'saude', 'pet'].some(p => texto.includes(p))) {
      newState.subproduto = texto.includes('pet')
        ? 'pet'
        : texto.includes('odonto')
        ? 'odonto'
        : 'saude';

      newState.etapa = 'FINAL';
      return {
        resposta: 'Perfeito! Prompt do flyer de Benefícios pronto.',
        state: newState
      };
    }

    return { resposta: 'Escolha Saúde, Odonto ou Pet.', state };
  }

  /* ================= FINAL ================= */
  if (state.etapa === 'FINAL') {
    return {
      resposta: 'Tudo pronto. Posso gerar o flyer agora.',
      state
    };
  }

  return { resposta: 'Erro de fluxo.', state };
}