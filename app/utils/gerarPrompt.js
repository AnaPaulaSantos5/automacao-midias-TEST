export function gerarPrompt(state) {
  if (!state || !state.area || !state.subproduto) {
    throw new Error('State inválido');
  }

  const {
    area,
    subproduto,
    meses,
    campanha = {},
    tabela = { colunas: [], linhas: [] },
    lances = [],
    rodape = ''
  } = state;

  if (area !== 'confi-financas') {
    throw new Error('Área não suportada');
  }

  const imagemBase =
    subproduto === 'imovel'
      ? 'Casa moderna de alto padrão, arquitetura contemporânea, fotografia realista'
      : subproduto === 'automovel'
      ? 'Carro atual em cenário urbano realista'
      : 'Caminhão moderno em estrada, fotografia profissional';

  return `
Imagem vertical.

A imagem é dividida em três partes claras e obrigatórias:

PARTE SUPERIOR (30% da altura):
Imagem fotográfica mostrando:
${imagemBase}

A imagem NÃO ocupa o flyer inteiro.

Aplicar overlays pretos muito suaves nas laterais da imagem (20% a 30% de cada lado).

No canto inferior esquerdo da imagem:
Texto branco:
"${subproduto.toUpperCase()} | ${meses} MESES"

No canto inferior direito da imagem:
Texto branco maior:
"${campanha.textoPrincipal || ''}"
${campanha.textoAuxiliar ? `Texto menor logo abaixo: "${campanha.textoAuxiliar}"` : ''}

PARTE CENTRAL (50% da altura):
Fundo preto sólido.

Sobre esse fundo preto, uma tabela centralizada com:
- fundo branco
- bordas arredondadas
- bem destacada

Cabeçalho da tabela com cores fixas:
Crédito: fundo #2c3da7, texto branco
Taxa Adm: fundo #000000, texto branco
Parcela Pessoa Física: fundo #1260c7, texto branco
Parcela Pessoa Jurídica: fundo #5691df, texto branco

Colunas:
${tabela.colunas.join(' | ')}

Linhas:
${tabela.linhas.map(l => `- ${l}`).join('\n')}

Fonte preta, clara e extremamente legível.

Logo abaixo da tabela:
Um retângulo horizontal menor, largura igual à tabela, cor #2c3da7.

Dentro desse retângulo:
${lances.length ? lances.map(l => `Texto branco pequeno: "${l}"`).join('\n') : 'Sem texto de lances.'}

PARTE INFERIOR (20% da altura):
Fundo preto.

Texto legal centralizado, fonte pequena, cinza claro:
"${rodape}"

Resultado final:
Imagem organizada, limpa, fiel ao layout descrito, sem elementos extras.
`.trim();
}