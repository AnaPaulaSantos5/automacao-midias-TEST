import { produtos } from "../data/produtos";
import { normalizarTexto } from "./normalizacao";

export function resolverProduto(texto) {
  const t = normalizarTexto(texto);

  for (const key of Object.keys(produtos)) {
    const nome = normalizarTexto(produtos[key].nomeExibicao);
    if (t.includes(nome.split(" ")[0])) {
      return key;
    }
  }

  return null;
}