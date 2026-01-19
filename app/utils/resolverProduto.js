import { produtos } from '../data/produtos';

const aliases = {
  seguro_residencial: ['seguro residencial', 'residencial', 'casa', 'lar', 'home'],
  seguro_auto: ['seguro auto', 'auto', 'carro', 'veículo', 'automóvel'],
  seguro_odonto: ['seguro odonto', 'odonto', 'dentista', 'sorriso'],
  plano_saude: ['plano de saúde', 'saúde', 'health'],
  seguro_pet: ['seguro pet', 'pet', 'animal', 'cachorro', 'gato'],
  consorcio: ['consórcio', 'consorcio', 'finanças', 'parcelas', 'grupo']
};

export function resolverProduto(texto) {
  const t = (texto || '').toLowerCase();

  // 1️⃣ CATEGORIAS (NÃO SÃO PRODUTOS)
  if (t === 'seguro' || t.includes(' seguro')) {
    return { categoria: 'seguro' };
  }

  if (t === 'benefícios' || t === 'beneficios' || t.includes('benef')) {
    return { categoria: 'beneficios' };
  }

  // 2️⃣ PRODUTOS DIRETOS (aliases)
  for (const key in aliases) {
    for (const termo of aliases[key]) {
      if (t.includes(termo)) {
        return produtos[key];
      }
    }
  }

  return null;
}