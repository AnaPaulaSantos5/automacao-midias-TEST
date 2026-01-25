export function normalizarConsorcioTabelaState(raw) {
  return {
    subproduto: normalizarTexto(raw?.subproduto),
    meses: normalizarNumero(raw?.meses),
    campanha: normalizarCampanha(raw?.campanha),
    tabela: normalizarTabela(raw?.tabela),
    lances: normalizarLances(raw?.lances),
    rodapeLegal: normalizarTexto(raw?.rodapeLegal)
  };
}

/* ==================== HELPERS ==================== */

function normalizarTexto(valor) {
  if (!valor || typeof valor !== 'string') return '';
  return valor.trim();
}

function normalizarNumero(valor) {
  if (!valor) return '';
  return String(valor).replace(/\D/g, '');
}

function normalizarCampanha(valor) {
  if (!valor) return { textoPrincipal: '', textoAuxiliar: '' };
  if (typeof valor === 'string') return { textoPrincipal: valor, textoAuxiliar: '' };
  return valor;
}

function normalizarTabela(tabela) {
  if (!Array.isArray(tabela)) return { colunas: [], linhas: [] };

  const colunas = tabela?.colunas ?? [];
  const linhas = tabela?.linhas ?? [];
  return { colunas, linhas };
}

function normalizarLances(lances) {
  if (!Array.isArray(lances)) return [];
  return lances.map((l) => (typeof l === 'string' ? l.trim() : ''));
}