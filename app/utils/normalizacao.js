export function normalizarCanal(texto) {
  const t = texto.toLowerCase();
  if (t.includes('insta')) return 'Instagram';
  if (t.includes('whats')) return 'WhatsApp';
  return null;
}

export function normalizarFormato(texto) {
  const t = texto.replace(/\s/g, '');
  if (['1:1', '4:5', '9:16'].includes(t)) return t;
  return null;
}

export function normalizarSubtipoConsorcio(texto) {
  const t = texto.toLowerCase();
  if (t.includes('imov')) return 'imovel';
  if (t.includes('auto') || t.includes('carro')) return 'automovel';
  if (t.includes('pesad') || t.includes('caminh')) return 'pesados';
  return null;
}