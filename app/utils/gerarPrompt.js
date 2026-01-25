export function gerarPrompt(state) {
  const {
    area,
    produto,
    subproduto,
    meses,
    campanha,
    textoComplementar,
    tabela,
    lances,
    textoLegal
  } = state;

  /* ======================================================
     CONFI FINANÇAS — CONSÓRCIO COM TABELA
  ====================================================== */

  if (
    area === 'Finanças' &&
    produto === 'Consórcio' &&
    tabela &&
    Array.isArray(tabela.linhas)
  ) {
    return `
Flyer publicitário vertical institucional da marca CONFI FINANÇAS.

IDENTIDADE VISUAL (OBRIGATÓRIA):
- Estilo corporativo, limpo, organizado, profissional.
- Fonte principal: Causten ou equivalente geométrica moderna.
- Paleta fixa:
  - Azul escuro: #2c3da7
  - Azul principal: #1260c7
  - Azul claro: #5691df
  - Branco: #ffffff
  - Preto: #000000
- NÃO usar elementos aleatórios, gradientes, sombras exageradas ou ícones decorativos.
- NÃO inventar textos legais, se não houver texto legal, NÃO escrever nada.

FORMATO:
- Flyer vertical (proporção 4:5 ou 1080x1350).
- Layout rigidamente dividido em áreas.

========================================================
LAYOUT ESTRUTURAL (NÃO DESVIAR)
========================================================

1) TOPO — 30% DA ALTURA TOTAL
- Imagem fotográfica ocupando APENAS o topo (30%).
- Tipo de imagem conforme subproduto:
  • Imóvel → casa moderna contemporânea
  • Automóvel → carro simples, moderno, fundo neutro
  • Pesados → caminhão em estrada
- Aplicar overlays pretos suaves nas laterais da imagem (20% a 30% de opacidade).
- A imagem NÃO pode invadir o restante do flyer.
- NÃO cortar o assunto principal da imagem.
- Textos institucionais (produto, meses e campanha) posicionados no final da imagem, levemente acima da tabela, bem alinhados e legíveis.

Textos no TOPO:
- Produto: Consórcio ${subproduto}
- Prazo: ${meses} meses
- Destaque da campanha: ${campanha}

========================================================
2) BLOCO CENTRAL — 50% DA ALTURA
========================================================

- Fundo PRETO sólido (#000000).
- Centralizado neste fundo, uma TABELA com:
  - Fundo branco sólido (#ffffff)
  - Bordas arredondadas
  - Boa margem interna
  - Alta legibilidade

TABELA — CABEÇALHO (OBRIGATÓRIO):
- Coluna 1: "Crédito"
  • Fundo: #2c3da7
  • Texto branco (#ffffff)
- Coluna 2: "Taxa Adm"
  • Fundo: #000000
  • Texto branco (#ffffff)
- Coluna 3: "Parcela Pessoa Física"
  • Fundo: #1260c7
  • Texto branco (#ffffff)
- Coluna 4: "Parcela Pessoa Jurídica"
  • Fundo: #5691df
  • Texto branco (#ffffff)

TABELA — CONTEÚDO:
- Fonte preta, clara e legível.
- Alinhamento limpo e consistente.
- NÃO alterar valores.
- NÃO inventar linhas.

Colunas:
${tabela.colunas.join(' | ')}

Linhas:
${tabela.linhas.map(l => l.join(' | ')).join('\n')}

--------------------------------------------------------
ABAIXO DA TABELA:
- Um retângulo horizontal com largura igual à tabela.
- Altura menor.
- Cor de fundo: #2c3da7
- Texto centralizado, branco, em negrito (Causten).
- Texto exatamente como informado pelo usuário:
"${lances}"

========================================================
3) RODAPÉ — 20% DA ALTURA
========================================================

- Fundo preto sólido (#000000).
- Texto legal em fonte pequena, cinza claro.
- Alinhado ao centro.
- NÃO resumir, NÃO adaptar, NÃO criar texto.

Texto legal:
${textoLegal || ''}

========================================================
REGRAS CRÍTICAS (NÃO QUEBRAR):
- NÃO escrever “texto legal”, “exemplo”, “placeholder”.
- NÃO ocupar o flyer inteiro com imagem.
- NÃO mover a tabela para cima da imagem.
- NÃO estilizar diferente do descrito.
- NÃO improvisar layout.
- O layout deve parecer padronizado e reutilizável.
`;
  }

  /* ======================================================
     FALLBACK (OUTROS PRODUTOS)
  ====================================================== */

  return `
Flyer institucional corporativo da marca CONFI.
Estilo limpo, profissional e organizado.
`;
}