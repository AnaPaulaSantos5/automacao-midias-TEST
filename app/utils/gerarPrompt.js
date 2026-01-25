export function gerarPrompt(state) {
  if (!state || state.area !== 'confi-financas') {
    throw new Error('State inválido');
  }

  const {
    subproduto,
    meses,
    campanha = {},
    tabela = { colunas: [], linhas: [] },
    lances = [],
    rodape = ''
  } = state;

  const imagemBase =
    subproduto === 'imovel'
      ? 'Casa moderna de alto padrão, arquitetura contemporânea, fotografia realista'
      : subproduto === 'automovel'
      ? 'Carro atual em cenário urbano realista'
      : 'Caminhão moderno em estrada, fotografia profissional';

  return `
Crie uma imagem vertical com layout rigorosamente dividido em três blocos verticais.

==================================================
BLOCO 1 — IMAGEM SUPERIOR (EXATAMENTE 30% DA ALTURA)
==================================================

Este bloco ocupa apenas 30% da altura total da imagem.
A imagem NÃO pode ultrapassar esse limite.

Conteúdo da imagem:
${imagemBase}

Sobre a imagem, aplique DOIS overlays pretos translúcidos:
- Um overlay preto suave no lado esquerdo
- Um overlay preto suave no lado direito
Transparência leve (aprox. 20–30%).
Os overlays devem estar SOBRE a imagem, não fora dela.

TEXTOS SOBRE A IMAGEM (dentro dos 30%):

Canto inferior esquerdo:
Texto pequeno, branco, alinhado à esquerda:
"${subproduto.toUpperCase()} • ${meses} MESES"

Canto inferior direito:
Texto médio, branco, alinhado à direita:
"${campanha.textoPrincipal || ''}"
${campanha.textoAuxiliar ? `Texto menor logo abaixo: "${campanha.textoAuxiliar}"` : ''}

Nenhum texto grande.
Nenhum texto fora da imagem.

==================================================
BLOCO 2 — ÁREA DA TABELA (APROX. 50% DA ALTURA)
==================================================

Fundo preto sólido ocupando toda a largura.

Sobre este fundo preto, centralizar uma tabela com:
- Fundo branco
- Bordas arredondadas
- Proporção clara e organizada

Cabeçalho da tabela — CORES FIXAS (OBRIGATÓRIO):

Crédito:
• Fundo #2c3da7
• Texto branco

Taxa Adm:
• Fundo #000000
• Texto branco

Parcela Pessoa Física:
• Fundo #1260c7
• Texto branco

Parcela Pessoa Jurídica:
• Fundo #5691df
• Texto branco

Colunas exatamente nesta ordem:
${tabela.colunas.join(' | ')}

Linhas da tabela:
${tabela.linhas.map(l => `- ${l}`).join('\n')}

Fonte preta, simples, altamente legível.
Nenhuma estilização criativa.

Abaixo da tabela:
Um retângulo horizontal menor,
mesma largura da tabela,
cor #2c3da7,
bordas levemente arredondadas.

Dentro do retângulo:
${lances.length
  ? lances.map(l => `Texto branco pequeno e em negrito: "${l}"`).join('\n')
  : 'Nenhum texto de lance.'}

==================================================
BLOCO 3 — RODAPÉ (APROX. 20% DA ALTURA)
==================================================

Fundo preto sólido.

Texto legal centralizado,
fonte pequena,
cor cinza-claro:

"${rodape}"

==================================================
REGRAS FINAIS (NÃO QUEBRAR)
==================================================

- A imagem nunca pode ultrapassar 30% da altura
- Os overlays devem ser camadas sobre a imagem
- A tabela nunca pode ficar sobre a imagem
- As cores do cabeçalho não podem ser alteradas
- Não adicionar elementos extras
- Layout limpo, técnico e organizado
`.trim();
}