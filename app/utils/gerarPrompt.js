export function gerarPrompt(state) {
  if (!state || !state.area) {
    throw new Error('State inválido');
  }

  const {
    area,
    subproduto,
    meses,
    campanha,
    tabela,
    textoComplementar
  } = state;

  /* ======================================================
     CONFI FINANÇAS — CONSÓRCIO COM TABELA
  ====================================================== */
  if (area === 'confi-financas' && subproduto) {
    const imagemTopo =
      subproduto === 'imovel'
        ? 'casa moderna contemporânea, fotografia realista, iluminação natural'
        : subproduto === 'automovel'
        ? 'carro simples e atual em ambiente urbano ou estrada, fotografia realista'
        : 'caminhão moderno em estrada com vegetação ao redor, fotografia realista';

    return `
A imagem contém uma composição vertical estruturada da seguinte forma:

NO TOPO:
- Uma imagem ocupando aproximadamente o terço superior da composição.
- A imagem mostra ${imagemTopo}.
- A imagem não ocupa a composição inteira.
- Existem overlays pretos muito suaves nas laterais da imagem, cobrindo cerca de 20% a 30% da largura.
- Sobre a imagem, próximo à base e antes da tabela, aparecem textos claros e legíveis:
  - Texto informativo com o prazo: "${meses} meses"
  - Texto de campanha principal: "${campanha?.textoPrincipal || ''}"

ABAIXO DA IMAGEM:
- Um fundo preto sólido (#000000) ocupa todo o restante da composição.
- Nenhuma imagem aparece nesta área.

BLOCO CENTRAL:
- Uma tabela centralizada sobre o fundo preto.
- A tabela possui fundo branco sólido e bordas arredondadas.
- A tabela é o elemento visual principal da composição.

CABEÇALHO DA TABELA (CORES FIXAS):
- Coluna "Crédito": fundo #2c3da7 com texto branco (#ffffff).
- Coluna "Taxa Adm": fundo #000000 com texto branco (#ffffff).
- Coluna "Parcela Pessoa Física": fundo #1260c7 com texto branco (#ffffff).
- Coluna "Parcela Pessoa Jurídica": fundo #5691df com texto branco (#ffffff).

TÍTULOS DAS COLUNAS:
${tabela.colunas.join(' | ')}

LINHAS DA TABELA (VALORES EXATOS):
${tabela.linhas.map(linha => `- ${linha}`).join('\n')}

- O texto da tabela é preto, claro, legível e sem estilização criativa.

ABAIXO DA TABELA:
- Um retângulo horizontal com a mesma largura da tabela.
- Fundo na cor #2c3da7.
- Altura menor que a tabela.
- Dentro desse retângulo, texto branco, pequeno e em negrito informando lances, conforme definido pelo usuário.

RODAPÉ:
- Texto legal pequeno, centralizado.
- Cor cinza-claro.
- Conteúdo:
"${textoComplementar || ''}"

RESTRIÇÕES IMPORTANTES:
- Não gerar prédios genéricos ou skyline urbano.
- Não omitir a tabela.
- Não alterar as cores definidas.
- Não inventar textos, valores ou elementos gráficos.
- Não usar outras imagens além da imagem do topo.

O resultado final deve ser organizado, legível e fiel à estrutura descrita acima.
`.trim();
  }

  throw new Error('Combinação de produto não suportada');
}