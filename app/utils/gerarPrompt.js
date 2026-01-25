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

  /* ======================================================
     CONFI FINANÇAS — CONSÓRCIO COM TABELA
  ====================================================== */
  if (area === 'confi-financas' && produto === 'financas') {
    const imagemBase =
      subproduto === 'imovel'
        ? 'Casa moderna contemporânea, fotografia realista, ângulo frontal, iluminação natural'
        : subproduto === 'automovel'
        ? 'Carro simples e atual em ambiente urbano, fotografia realista'
        : 'Caminhão moderno em estrada, fotografia profissional';

    return `
Criar uma flyer vertical seguindo EXATAMENTE a estrutura abaixo.
Não inventar layout diferente.
Não mover elementos de faixa.
Não omitir nenhuma faixa.

==================================================
FAIXA 1 — IMAGEM (APROX. 25% DA ALTURA TOTAL)
==================================================

Imagem ocupa apenas a parte superior do flyer.
Não ultrapassar esta faixa.

Imagem:
${imagemBase}

Sobre a imagem aplicar DOIS overlays pretos suaves,
um à esquerda e um à direita,
com opacidade entre 20% e 30%.
Os overlays devem ser sutis, elegantes, sem parecer blocos sólidos.

Dentro da imagem, próximo à base da faixa:

LADO ESQUERDO:
Texto:
"${subproduto === 'imovel' ? 'Imóvel' : subproduto === 'automovel' ? 'Automóvel' : 'Pesados'}"
Fonte Causten, branca, negrito.
Logo abaixo:
"${meses} meses"
Fonte Causten, branca, regular.
Não unir os textos em uma única linha.
Não usar separadores como ponto ou hífen.

LADO DIREITO:
Texto da campanha:
"${campanha?.textoPrincipal || ''}"
Fonte branca, maior que os textos do lado esquerdo,
alinhamento à direita.
Se existir texto auxiliar:
"${campanha?.textoAuxiliar || ''}"
Fonte branca menor logo abaixo.

==================================================
FAIXA 2 — FUNDO DA TABELA
==================================================

Logo abaixo da imagem criar um bloco de fundo PRETO sólido
ocupando toda a largura do flyer.
Este fundo serve EXCLUSIVAMENTE para destacar a tabela.

==================================================
FAIXA 2A — TABELA (ELEMENTO CENTRAL)
==================================================

Tabela centralizada dentro do fundo preto.
Fundo da tabela: branco.
Bordas arredondadas.

Cabeçalho da tabela (cores FIXAS):
Crédito → fundo #2c3da7 | texto branco
Taxa Adm → fundo #000000 | texto branco
Parcela Pessoa Física → fundo #1260c7 | texto branco
Parcela Pessoa Jurídica → fundo #5691df | texto branco

Títulos das colunas (copiar exatamente):
${tabela.colunas.join(' | ')}

Linhas da tabela (copiar exatamente, uma por linha):
${tabela.linhas.map(l => `• ${l}`).join('\n')}

Fonte preta, clara, legível.
Não estilizar criativamente.
Não alterar ordem das colunas.

==================================================
FAIXA 3 — LANCES (OBRIGATÓRIA)
==================================================

Logo abaixo da tabela criar uma faixa horizontal fina.

Fundo sólido #2c3da7.
Largura exatamente igual à tabela.
Altura baixa.

Todos os textos devem ficar:
• na MESMA LINHA
• alinhados ao centro
• fonte Causten
• branca
• negrito
• tamanho pequeno

Textos dos lances (não alterar conteúdo):
${lances.length ? lances.join('   •   ') : ''}

Esta faixa NÃO pode ser omitida.

==================================================
FAIXA 4 — RODAPÉ (ÚLTIMA FAIXA)
==================================================

Abaixo da faixa de lances.

Fundo preto sólido.

Texto legal centralizado,
fonte pequena,
cinza-claro,
fonte Causten.

Texto do rodapé (copiar exatamente):
"${rodape || ''}"

==================================================
REGRAS FINAIS (OBRIGATÓRIAS)
==================================================

• Não estender a imagem além da FAIXA 1.
• Não mover rodapé para cima da tabela.
• Não unir produto e meses em uma única linha.
• Não ignorar lances.
• Não criar elementos extras.
• Não corrigir textos automaticamente.
• Manter hierarquia visual limpa e organizada.
`.trim();
  }

  throw new Error('Combinação de produto não suportada');
}