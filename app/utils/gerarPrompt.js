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
    lances,
    rodape
  } = state;

  /* ======================================================
     CONFI FINANÇAS — CONSÓRCIO
  ====================================================== */
  if (area === 'confi-financas' && produto === 'consorcio') {
    const imagemTopo =
      subproduto === 'imovel'
        ? 'Casa moderna, arquitetura contemporânea, fotografia realista, iluminação natural'
        : subproduto === 'automovel'
        ? 'Carro atual em ambiente urbano discreto, fotografia realista'
        : 'Caminhão moderno em estrada, cenário natural, fotografia realista';

    return `
Imagem vertical.

PARTE SUPERIOR – 30% DA IMAGEM
Imagem ocupando aproximadamente 30% da altura total.
Conteúdo da imagem:
${imagemTopo}

Aplicar overlays pretos (#000000) nas laterais esquerda e direita da imagem.
Opacidade aproximada entre 20% e 30%.
Overlay começa nas bordas e avança suavemente para o centro.
Não cobrir o centro da imagem.

TEXTOS SOBRE A IMAGEM (POSICIONADOS PRÓXIMOS À BASE DA IMAGEM)

LADO ESQUERDO (alinhamento à esquerda):
Texto 1: "Consórcio ${subproduto === 'imovel' ? 'Imóvel' : subproduto === 'automovel' ? 'Automóvel' : 'Pesados'}"
Texto 2: "${meses} meses"
Fonte branca, peso médio, hierarquia clara.

LADO DIREITO (alinhamento à direita):
Texto principal da campanha:
"${campanha.textoPrincipal}"
Fonte branca, maior que os textos da esquerda.

Os textos da esquerda e da direita não podem se sobrepor.
Manter margens internas confortáveis.

PARTE INFERIOR – 70% DA IMAGEM
Fundo totalmente preto (#000000).

BLOCO CENTRAL – TABELA
Tabela centralizada.
Fundo branco (#ffffff).
Bordas arredondadas.
A tabela deve se destacar claramente sobre o fundo preto.

CABEÇALHO DA TABELA – CORES FIXAS
Coluna 1 – Crédito:
Fundo #2c3da7, texto branco.
Coluna 2 – Taxa Adm:
Fundo #000000, texto branco.
Coluna 3 – Parcela Pessoa Física:
Fundo #1260c7, texto branco.
Coluna 4 – Parcela Pessoa Jurídica:
Fundo #5691df, texto branco.

Títulos das colunas:
${tabela.colunas.join(' | ')}

LINHAS DA TABELA (USAR EXATAMENTE ESTES VALORES)
${tabela.linhas.map(l => `• ${l}`).join('\n')}

Texto interno da tabela em preto.
Fonte clara, legível, sem estilização criativa.

BLOCO DE LANCES (ABAIXO DA TABELA)
Retângulo horizontal logo abaixo da tabela.
Mesma largura da tabela.
Altura menor.
Fundo #2c3da7.

Texto branco, fonte Causten, negrito.
Conteúdo:
${Array.isArray(lances) && lances.length > 0 ? lances.join(' | ') : 'Não exibir bloco de lances'}

Não inventar textos.
Não adicionar lances se o usuário não informar.

RODAPÉ LEGAL
Texto pequeno, cinza-claro.
Alinhamento central.
Conteúdo:
"${rodape}"

RESULTADO FINAL
Imagem organizada, com hierarquia clara.
Tabela como elemento principal.
Visual limpo, técnico e consistente.
`.trim();
  }

  throw new Error('Combinação de produto não suportada');
}