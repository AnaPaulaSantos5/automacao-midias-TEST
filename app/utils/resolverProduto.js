import { produtos } from '../data/produtos';

const aliases = {
  consorcio: [
    'consorcio',
    'consórcio',
    'financas',
    'finanças',
    'parcelas',
    'grupo'
  ],
  seguro_residencial: ['seguro residencial', 'residencial', 'casa', 'lar'],
  seguro_auto: ['seguro auto', 'auto', 'carro', 'veiculo'],
  plano_saude: ['plano de saude', 'saude'],
  seguro_odonto: ['odonto', 'dentista'],
  seguro_pet: ['pet', 'animal']
};

function normalizar(texto = '') {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function resolverProduto(texto) {
  const t = normalizar(texto);

  for (const key in aliases) {
    for (const termo of aliases[key]) {
      if (t.includes(normalizar(termo))) {
        return produtos[key] || null;
      }
    }
  }

  return null;
}