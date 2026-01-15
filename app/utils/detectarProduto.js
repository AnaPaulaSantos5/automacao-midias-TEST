export function detectarProduto(texto) {
  const t = texto.toLowerCase();

  if (t.includes("consórcio") || t.includes("consorcio")) {
    return { area: "financas", produto: "consorcio" };
  }

  if (t.includes("seguro residencial")) {
    return { area: "seguros", produto: "residencial" };
  }

  if (t.includes("seguro")) {
    return { area: "seguros", produto: "generico" };
  }

  if (t.includes("plano de saúde")) {
    return { area: "beneficios", produto: "saude" };
  }

  return null;
}
