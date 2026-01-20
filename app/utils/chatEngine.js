export function chatEngine(input, state) {
  const msg = input.toLowerCase();

  // 🔒 TRAVA FINAL
  if (state.etapa === 'FINAL') {
    return {
      content: 'Flyer pronto para geração.',
      state
    };
  }

  // START
  if (state.etapa === 'START') {
    state.etapa = 'AREA';
    return {
      content: 'Olá! Qual área deseja? Seguros, Finanças ou Benefícios?',
      state
    };
  }

  // AREA
  if (state.etapa === 'AREA') {
    if (msg.includes('seguro')) {
      state.area = 'SEGUROS';
      state.etapa = 'TIPO_SEGURO';
      return {
        content: 'Perfeito. Qual tipo de seguro? Geral ou Residencial?',
        state
      };
    }
  }

  // TIPO SEGURO
  if (state.etapa === 'TIPO_SEGURO') {
    if (msg.includes('residencial')) {
      state.produto = 'SEGURO_RESIDENCIAL';
      state.etapa = 'CONFIRMACAO';
      return {
        content: 'Perfeito. Vou preparar o flyer conforme o padrão da Confi Seguros. Posso gerar agora?',
        state
      };
    }
  }

  // CONFIRMAÇÃO
  if (state.etapa === 'CONFIRMACAO') {
    if (
      msg.includes('sim') ||
      msg.includes('pode') ||
      msg.includes('ok')
    ) {
      state.etapa = 'FINAL';
      return {
        content: 'Tudo pronto. Gerando o flyer.',
        state
      };
    }

    return {
      content: 'Posso gerar o flyer agora?',
      state
    };
  }

  return {
    content: 'Não entendi. Pode repetir?',
    state
  };
}