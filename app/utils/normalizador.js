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

export function normalizarSubtipoConsorcio(texto) {
  const t = texto.toLowerCase();

  if (
    t.includes('imóvel') ||
    t.includes('imovel') ||
    t.includes('casa') ||
    t.includes('apart')
  ) {
    return 'imovel';
  }

  if (
    t.includes('auto') ||
    t.includes('carro') ||
    t.includes('veículo') ||
    t.includes('veiculo')
  ) {
    return 'auto';
  }

  if (
    t.includes('pesado') ||
    t.includes('caminhão') ||
    t.includes('caminhao') ||
    t.includes('ônibus') ||
    t.includes('onibus')
  ) {
    return 'pesados';
  }

  return null;
}