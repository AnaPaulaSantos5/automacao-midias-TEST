import { produtos } from '../data/produtos';

/**
 * Constrói o PROMPT FINAL do flyer com base
 * no contexto validado pelo chatEngine
 */
export function buildFlyerPayload(context) {
  const produto = produtos[context.produto.key];

  if (!produto) {
    throw new Error('Produto não encontrado para geração do prompt');
  }

  const {
    canal,
    formato,
    subproduto,
    textoPrincipal,
    textoComplementar,
    textoLegal,
    modelo,
    tabela
  } = context;

  /* =========================
     IDENTIDADE VISUAL
  ========================= */

  let prompt = `
Crie um flyer profissional seguindo RIGOROSAMENTE esta identidade visual:

Marca: ${produto.identidadeVisual.marca}
Paleta de cores: ${produto.identidadeVisual.paleta.join(', ')}
Canal: ${canal}
Formato: ${formato}
`;

  /* =========================
     PRODUTO
  ========================= */

  if (context.produto.key === 'consorcio') {
    prompt += `
Produto: Consórcio ${subproduto}

Estilo visual premium, institucional, confiável.
Imagem de fundo deve variar conforme o subtipo:
- Imóvel: casa moderna, ambiente urbano, entardecer.
- Automóvel: carro moderno em estrada, com casas ao fundo.
- Pesados: caminhão em estrada com árvores ao redor.
`;
  } else {
    prompt += `
Produto: ${produto.nomeExibicao}

Imagem de pessoas transmitindo segurança, tranquilidade e bem-estar.
Ambiente aconchegante, iluminado, estilo realista.
`;
  }

  /* =========================
     TEXTO PRINCIPAL (CAMPANHA)
  ========================= */

  if (textoPrincipal) {
    prompt += `
Texto principal (campanha):
"${textoPrincipal}"
`;
  } else {
    prompt += `
Texto principal:
Gerar automaticamente um texto persuasivo alinhado ao produto, transmitindo confiança e benefício claro ao cliente.
`;
  }

  /* =========================
     CONSÓRCIO – MODELOS
  ========================= */

  if (context.produto.key === 'consorcio') {
    if (modelo === 'B' && tabela) {
      prompt += `
Modelo B – COM TABELA

A tabela deve ser o elemento central do layout.
Fundo branco, bordas arredondadas.

Cabeçalhos da tabela (cores específicas):
- Crédito: fundo azul escuro (#2c3da7), texto branco
- Taxa ADM: fundo preto (#000000), texto branco
- Parcela Pessoa Física: fundo azul principal (#1260c7), texto branco
- Parcela Pessoa Jurídica: fundo azul claro (#5691df), texto branco

Colunas:
${tabela.colunas.join(' | ')}

Linhas da tabela:
${tabela.linhas.map(l => `- ${l}`).join('\n')}

Fonte preta, clara e altamente legível.
`;
    } else {
      prompt += `
Modelo A – SEM TABELA

Layout simples:
Imagem forte + texto emocional.
Foco em conquista de sonhos (casa própria, veículo, crescimento).
`;
    }
  }

  /* =========================
     TEXTO COMPLEMENTAR
  ========================= */

  if (textoComplementar) {
    prompt += `
Texto complementar (abaixo do conteúdo principal):
"${textoComplementar}"
`;
  }

  /* =========================
     TEXTO LEGAL (RODAPÉ)
  ========================= */

  if (textoLegal) {
    prompt += `
Rodapé – Texto legal:
"${textoLegal}"

Fonte pequena, cinza-claro, alinhada ao centro.
`;
  }

  /* =========================
     FINALIZAÇÃO
  ========================= */

  prompt += `
O layout deve ser limpo, profissional, organizado e fiel à identidade visual da marca Confi.
Evitar elementos gráficos desnecessários.
Não inventar informações.
`;

  return prompt.trim();
}