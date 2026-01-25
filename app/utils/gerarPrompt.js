export function gerarPrompt(state) {
  if (!state || !state.area) {
    throw new Error('State inválido');
  }

  const {
    area,
    produto,
    subproduto,
    meses,
    campanha,
    tabela,
    lances = [],
    rodape
  } = state;

  if (area === 'confi-financas' && produto === 'financas') {
    const imagemBase =
      subproduto === 'imovel'
        ? 'Casa moderna contemporânea, fotografia realista, enquadramento horizontal, iluminação natural'
        : subproduto === 'automovel'
        ? 'Carro simples e atual em ambiente urbano, fotografia realista'
        : 'Caminhão moderno em estrada, fotografia profissional';

    return `
Criar uma flyer vertical seguindo RIGOROSAMENTE a estrutura abaixo.
Não reinterpretar layout.
Não omitir elementos.
Não corrigir textos do usuário.

==================================================
FAIXA 1 — IMAGEM (NO MÁXIMO 20% DA ALTURA TOTAL)
==================================================

Imagem ocupa somente a parte superior do flyer.

Imagem:
${imagemBase}

Aplicar DOIS overlays verticais pretos,
um na lateral esquerda e outro na lateral direita.
Opacidade entre 20% e 30%.
Overlays devem ser suaves, integrados à imagem,
não parecer blocos decorativos.

TEXTOS SOBRE A IMAGEM (ALINHADOS À BASE DA IMAGEM):

LADO ESQUERDO:
Texto 1:
"${subproduto === 'imovel' ? 'Imóvel' : subproduto === 'automovel' ? 'Automóvel' : 'Pesados'}"
Fonte Causten, branca, NEGRITO.

Texto 2 (abaixo):
"${meses} meses"
Fonte Causten, branca, REGULAR.
Nunca unir esses textos em uma única linha.

LADO DIREITO — TEXTO DE CAMPANHA:
Usar o texto exatamente como fornecido:
"${campanha?.textoPrincipal || ''}"

Aplicar hierarquia:
• Se existir número ou porcentagem:
  - número em Causten NEGRITO, maior
  - texto antes em tamanho médio
  - texto depois em tamanho menor
• Se não existir número:
  - primeira palavra maior
  - restante em tamanho médio

Se existir texto auxiliar:
"${campanha?.textoAuxiliar || ''}"
Fonte menor logo abaixo.

==================================================
FAIXA 2 — FUNDO DA TABELA
==================================================

Logo abaixo da imagem,
criar um bloco PRETO sólido ocupando toda a largura.
Este bloco serve exclusivamente como fundo da tabela.

==================================================
FAIXA 2A — TABELA
==================================================

Tabela centralizada.
Fundo branco.
Bordas arredondadas.

A tabela DEVE conter exatamente 4 colunas.
Não remover colunas.
Não reduzir conteúdo.

Cabeçalho (cores FIXAS):
Crédito → #2c3da7
Taxa Adm → #000000
Parcela Pessoa Física → #1260c7
Parcela Pessoa Jurídica → #5691df
Texto branco em todas.

Títulos (copiar exatamente):
${tabela.colunas.join(' | ')}

Linhas (copiar exatamente):
${tabela.linhas.map(l => `• ${l}`).join('\n')}

Fonte preta, legível, sem estilização criativa.

==================================================
FAIXA 3 — LANCES (OBRIGATÓRIA)
==================================================

Logo abaixo da tabela.

Faixa horizontal com:
• fundo #2c3da7
• largura igual à tabela
• altura baixa

Todos os textos:
• mesma linha
• centralizados
• Causten
• branco
• negrito
• tamanho pequeno

Textos (não alterar):
${lances.length ? lances.join('   •   ') : ''}

==================================================
FAIXA 4 — RODAPÉ (ÚLTIMA FAIXA)
==================================================

Última área do flyer.
Nunca sobrepor à tabela.

Fundo preto sólido.
Texto centralizado.
Fonte Causten pequena.
Cor cinza-claro.

Texto (copiar exatamente):
"${rodape || ''}"

==================================================
REGRAS FINAIS
==================================================

• Não aumentar a imagem.
• Não omitir overlays.
• Não remover colunas.
• Não reescrever textos.
• Não corrigir português.
• Não mover o rodapé.
• Não criar elementos extras.
`.trim();
  }

  throw new Error('Combinação de produto não suportada');
}