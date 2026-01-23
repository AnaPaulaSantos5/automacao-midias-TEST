export function normalizarStateFinal(state) {
  const normalizado = { ...state };

  /* ================= CAMPANHA ================= */
  if (typeof normalizado.campanha === 'string') {
    normalizado.campanha = {
      titulo: normalizado.campanha
    };
  }

  if (
    normalizado.campanha &&
    typeof normalizado.campanha === 'object' &&
    !normalizado.campanha.titulo
  ) {
    normalizado.campanha = null;
  }

  /* ================= TABELA ================= */
  if (normalizado.tabela) {
    const { colunas, linhas } = normalizado.tabela;

    if (Array.isArray(colunas) && Array.isArray(linhas)) {
      normalizado.tabela = {
        colunas,
        linhas: linhas.map(linha =>
          Array.isArray(linha)
            ? linha.map(String)
            : Object.values(linha).map(String)
        )
      };
    } else {
      normalizado.tabela = null;
    }
  }

  return normalizado;
}