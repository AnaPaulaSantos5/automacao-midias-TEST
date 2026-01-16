export function identificarProduto(texto) {
  const t = texto.toLowerCase();

  if (t.includes("consórcio") || t.includes("consorcio")) return "consorcio";
  if (t.includes("seguro residencial")) return "seguro_residencial";
  if (t.includes("seguro")) return "seguro";
  if (t.includes("pet")) return "pet";
  if (t.includes("odonto")) return "odonto";
  if (t.includes("saúde") || t.includes("saude")) return "saude";

  return null;
}
