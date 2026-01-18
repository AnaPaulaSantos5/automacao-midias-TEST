import { produtos } from '../data/produtos';

const aliases = {
  consorcio: ['consórcio', 'consorcio', 'finanças', 'parcelas', 'grupo'],
  seguro_residencial: ['seguro residencial', 'residencial', 'casa', 'lar', 'home'],
  seguro_auto: ['seguro auto', 'carro', 'veículo', 'automóvel'],
  plano_saude: ['plano de saúde', 'saúde', 'health'],
  seguro_odonto: ['seguro odonto', 'odonto', 'dentista', 'sorriso'],
  seguro_pet: ['seguro pet', 'pet', 'animal', 'cachorro', 'gato']
};

export function resolverProduto(texto) {
  const t = (texto || '').toLowerCase();

  // Primeiro verifica se o usuário mencionou algum alias conhecido
  for (const key in aliases) {
    const termos = aliases[key];
    for (const termo of termos) {
      if (t.includes(termo)) {
        return produtos[key];
      }
    }
  }

  // Fallback manual para consórcio
  if (t.includes('consórcio') || t.includes('consorcio')) {
    return produtos.consorcio;
  }

  return null;
}