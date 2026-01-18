export function normalizarCanal(texto) {
  const t = texto.toLowerCase();

  if (t.includes('insta')) return 'instagram';
  if (t.includes('whats')) return 'whatsapp';

  return null;
}

export function normalizarFormato(texto) {
  const t = texto.replace(/\s/g, '').toLowerCase();

  if (t === '1:1' || t === '11') return '1:1';
  if (t === '4:5' || t === '45') return '4:5';
  if (t === '9:16' || t === '916' || t === '9x16') return '9:16';

  return null;
}