export function validarFlyer(flyerConfig, payload) {
  const erros = [];

  // 1. Campos obrigatórios
  if (flyerConfig.camposObrigatorios) {
    flyerConfig.camposObrigatorios.forEach((campo) => {
      if (!payload[campo]) {
        erros.push(`Campo obrigatório ausente: ${campo}`);
      }
    });
  }

  // 2. Formato permitido
  const { canal, formato } = payload;

  if (
    !flyerConfig.formatosPermitidos?.[canal]?.[formato]
  ) {
    erros.push("Formato inválido para o canal selecionado.");
  }

  // 3. Regras específicas de comportamento
  if (flyerConfig.comportamento?.possuiTabela) {
    if (payload.tabela) {
      if (!payload.colunasTabela || !payload.valoresTabela) {
        erros.push("Tabela exige colunas e valores.");
      }
    }
  }

  return {
    valido: erros.length === 0,
    erros
  };
}
