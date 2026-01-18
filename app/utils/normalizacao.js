export function normalizarTexto(texto = "") {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function normalizarFormato(texto) {
  const t = normalizarTexto(texto);

  if (t.includes("9:16") || t.includes("9x16") || t.includes("stories"))
    return "9:16";
  if (t.includes("4:5") || t.includes("4x5") || t.includes("vertical"))
    return "4:5";
  if (t.includes("1:1") || t.includes("quadrado"))
    return "1:1";

  return null;
}

export function normalizarCanal(texto) {
  const t = normalizarTexto(texto);
  if (t.includes("whats")) return "whatsapp";
  if (t.includes("insta")) return "instagram";
  return null;
}