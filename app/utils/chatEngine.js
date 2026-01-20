// app/utils/chatEngine.js

const normalizar = (texto = '') =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

export function chatEngine(input, state) {
  const mensagem = normalizar(input);

  // ===============================
  // PROTEÇÃO TOTAL DE STATE
  // ===============================
  if (!state || !state.etapa) {
    return respostaInicial();
  }

  // ===============================
  // START
  // ===============================
  if (state.etapa === 'START') {
    return {
      resposta: 'Olá! Qual área deseja? Seguros, Finanças ou Benefícios?',
      state: {
        ...state,
        etapa: 'ESCOLHA_AREA'
      }
    };
  }

  // ===============================
  // ESCOLHA ÁREA
  // ===============================
  if (state.etapa === 'ESCOLHA_AREA') {
    if (mensagem.includes('seguro')) {
      return {
        resposta: 'Perfeito. Qual tipo de seguro? Geral ou Residencial?',
        state: {
          ...state,
          area: 'confi-seguros',
          produto: 'seguros',
          etapa: 'ESCOLHA_SEGURO'
        }
      };
    }

    if (mensagem.includes('financa') || mensagem.includes('consorcio')) {
      return {
        resposta: 'Qual tipo de consórcio? Imóvel, Automóvel ou Pesados?',
        state: {
          ...state,
          area: 'confi-financas',
          produto: 'financas',
          etapa: 'ESCOLHA_CONSORCIO'
        }
      };
    }

    if (mensagem.includes('beneficio')) {
      return {
        resposta: 'Qual produto deseja criar? Saúde, Odonto ou Pet?',
        state: {
          ...state,
          area: 'confi-beneficios',
          produto: 'beneficios',
          etapa: 'ESCOLHA_BENEFICIO'
        }
      };
    }

    return respostaErroArea(state);
  }

  // ===============================
  // SEGUROS
  // ===============================
  if (state.etapa === 'ESCOLHA_SEGURO') {
    if (mensagem.includes('residencial')) {
      return {
        resposta: 'Deseja que eu gere a frase automaticamente ou prefere escrever?',
        state: {
          ...state,
          subproduto: 'residencial',
          etapa: 'SEGURO_TEXTO'
        }
      };
    }

    if (mensagem.includes('geral')) {
      return {
        resposta: 'Deseja que eu gere a frase automaticamente ou prefere escrever?',
        state: {
          ...state,
          subproduto: 'geral',
          etapa: 'SEGURO_TEXTO'
        }
      };
    }

    return respostaErroSeguro(state);
  }

  if (state.etapa === 'SEGURO_TEXTO') {
    if (mensagem.includes('gere')) {
      return {
        resposta: 'Deseja incluir informações de rodapé? (Sim ou Não)',
        state: {
          ...state,
          textoPrincipal: 'auto',
          etapa: 'SEGURO_RODAPE'
        }
      };
    }

    return {
      resposta: 'Escreva a frase principal do flyer.',
      state: {
        ...state,
        etapa: 'SEGURO_TEXTO_MANUAL'
      }
    };
  }

  if (state.etapa === 'SEGURO_TEXTO_MANUAL') {
    return {
      resposta: 'Deseja incluir informações de rodapé? (Sim ou Não)',
      state: {
        ...state,
        textoPrincipal: input,
        etapa: 'SEGURO_RODAPE'
      }
    };
  }

  if (state.etapa === 'SEGURO_RODAPE') {
    return {
      resposta: 'Perfeito! Posso gerar o flyer agora?',
      state: {
        ...state,
        textoComplementar: mensagem.includes('sim'),
        etapa: 'CONFIRMACAO_FINAL'
      }
    };
  }

  // ===============================
  // CONFIRMAÇÃO FINAL
  // ===============================
  if (state.etapa === 'CONFIRMACAO_FINAL') {
    if (mensagem === 'sim' || mensagem === 'ok' || mensagem === 'pode') {
      return {
        resposta: 'Flyer enviado para geração.',
        state: {
          ...state,
          etapa: 'FINALIZADO'
        },
        acao: 'GERAR_FLYER'
      };
    }

    return {
      resposta: 'Tudo bem. Caso queira ajustar algo, é só dizer.',
      state: {
        ...state
      }
    };
  }

  // ===============================
  // FINALIZADO
  // ===============================
  if (state.etapa === 'FINALIZADO') {
    return {
      resposta: 'Caso queira criar outro flyer, diga "novo flyer".',
      state: {
        ...state
      }
    };
  }

  // ===============================
  // FALLBACK ABSOLUTO
  // ===============================
  return respostaFallback(state);
}

// ===============================
// RESPOSTAS AUXILIARES
// ===============================
function respostaInicial() {
  return {
    resposta: 'Olá! Qual área deseja? Seguros, Finanças ou Benefícios?',
    state: {
      etapa: 'ESCOLHA_AREA',
      produto: null,
      area: null,
      subproduto: null
    }
  };
}

function respostaErroArea(state) {
  return {
    resposta: 'Não entendi. Escolha entre Seguros, Finanças ou Benefícios.',
    state: { ...state }
  };
}

function respostaErroSeguro(state) {
  return {
    resposta: 'Escolha entre Seguro Geral ou Residencial.',
    state: { ...state }
  };
}

function respostaFallback(state) {
  return {
    resposta: 'Vamos recomeçar com segurança. Qual área deseja?',
    state: {
      ...state,
      etapa: 'ESCOLHA_AREA'
    }
  };
}