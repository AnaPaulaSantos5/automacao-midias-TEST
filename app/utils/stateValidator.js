export function validarState(state) {
  const errors = [];

  if (!state) {
    return {
      ok: false,
      errors: ['State inexistente'],
      state: null
    };
  }

  /* ======================
     VALIDAÇÕES GLOBAIS
  ====================== */

  if (!state.etapa) {
    errors.push('Etapa do fluxo não definida');
  }

  if (state.etapa === 'FINAL') {
    if (!state.area) {
      errors.push('Área não definida');
    }

    if (!state.produto && !state.subproduto) {
      errors.push('Produto ou subproduto não definido');
    }
  }

  /* ======================
     CONFI FINANÇAS
  ====================== */
  if (state.area === 'confi-financas') {
    if (!state.subproduto) {
      errors.push('Subproduto do consórcio não definido');
    }

    if (!['imovel', 'automovel', 'pesados'].includes(state.subproduto)) {
      errors.push('Subproduto de consórcio inválido');
    }

    if (!state.meses) {
      errors.push('Número de meses não informado');
    }

    if (!state.campanha?.textoPrincipal) {
      errors.push('Texto principal da campanha não informado');
    }

    if (!state.tabela?.colunas || state.tabela.colunas.length < 2) {
      errors.push('Tabela de consórcio incompleta (colunas)');
    }

    if (!state.tabela?.linhas || state.tabela.linhas.length < 1) {
      errors.push('Tabela de consórcio incompleta (linhas)');
    }
  }

  /* ======================
     CONFI SEGUROS
  ====================== */
  if (state.area === 'confi-seguros') {
    if (!state.subproduto) {
      errors.push('Tipo de seguro não definido');
    }

    if (!['geral', 'residencial'].includes(state.subproduto)) {
      errors.push('Tipo de seguro inválido');
    }
  }

  /* ======================
     CONFI BENEFÍCIOS
  ====================== */
  if (state.area === 'confi-beneficios') {
    if (!state.subproduto) {
      errors.push('Tipo de benefício não definido');
    }

    if (!['odonto', 'saude', 'pet'].includes(state.subproduto)) {
      errors.push('Tipo de benefício inválido');
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    state
  };
}