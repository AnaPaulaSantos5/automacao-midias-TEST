export function normalizarFormato(input) {
  const v = input.toLowerCase().replace(/\s/g, '');

  if (v === '1:1' || v === '1x1') return '1:1';
  if (v === '4:5' || v === '4x5') return '4:5';
  if (v === '9:16' || v === '9x16') return '9:16';

  return null;
}

export function normalizarCanal(input) {
  const v = input.toLowerCase();

  if (v.includes('insta')) return 'instagram';
  if (v.includes('what')) return 'whatsapp';

  return null;
}
