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

/* Helpers */

function normalizarTexto(valor) {
  if (!valor || typeof valor !== 'string') return '';
  return valor.trim();
}

function normalizarNumero(valor) {
  if (!valor) return '';
  return String(valor).replace(/\D/g, '');
}

function normalizarCampanha(valor) {
  if (!valor) return '';
  return valor.replace(/\s+/g, ' ').trim();
}

function normalizarTabela(tabela) {
  if (!Array.isArray(tabela)) return [];

  return tabela.map((linha) => ({
    credito: linha.credito ?? '',
    taxa: linha.taxa ?? '',
    parcelaPF: linha.parcelaPF ?? '',
    parcelaPJ: linha.parcelaPJ ?? ''
  }));
}

function normalizarLances(lances) {
  if (!Array.isArray(lances)) return [];

  return lances.map((l) =>
    typeof l === 'string' ? l.trim() : ''
  );
}