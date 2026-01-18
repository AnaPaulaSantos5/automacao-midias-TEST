import { produtos } from '../../data/produtos';

export function resolverProduto(texto) {
  const t = texto.toLowerCase();

  for (const key in produtos) {
    if (t.includes(key.replace('_', ' '))) {
      return {
        key,
        ...produtos[key]
      };
    }
  }

  return null;
}