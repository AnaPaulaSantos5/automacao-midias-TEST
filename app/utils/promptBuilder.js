import { produtos } from "../data/produtos";

export function gerarPrompt(state) {
  const produto = produtos[state.produto];

  let prompt = `
Crie um flyer seguindo EXATAMENTE esta identidade visual:

Marca: ${produto.identidadeVisual.marca}
Paleta: ${produto.identidadeVisual.paleta.join(", ")}

Produto: ${produto.nomeExibicao}
Canal: ${state.canal}
Formato: ${state.formato}
`;

  // CONSÓRCIO – MODELOS
  if (state.produto === "consorcio") {
    if (state.modelo === "A") {
      prompt += `
Modelo A (emocional, SEM tabela):
Imagem de pessoas conquistando sonhos (${state.subtipo || "bem material"}).
Texto motivacional focado em conquista e planejamento.
Layout inspirado no flyer de Seguro Residencial.
`;
    }

    if (state.modelo === "B") {
      prompt += `
Modelo B (COM tabela):
Tabela central com colunas:
${state.tabela.cabecalho.join(" | ")}

Valores:
${state.tabela.valores.join("\n")}

Texto legal:
${state.tabela.rodape}
`;
    }
  }

  // OUTROS PRODUTOS
  if (state.produto !== "consorcio") {
    prompt += `
Layout seguindo fielmente o flyer-base descrito para ${produto.nomeExibicao}.
Texto emocional, CTA visível e identidade preservada.
`;
  }

  return prompt.trim();
}