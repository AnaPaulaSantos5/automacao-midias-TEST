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
      ? 'Casa moderna de arquitetura contemporânea, fotografia realista'
      : subproduto === 'automovel'
      ? 'Carro atual em ambiente urbano realista'
      : 'Caminhão moderno em estrada, fotografia profissional';

  return `
Crie uma imagem vertical com layout rígido e controlado, seguindo exatamente as divisões abaixo.

==================================================
BLOCO 1 — IMAGEM SUPERIOR (APROX. 25% DA ALTURA TOTAL)
==================================================

A imagem deve ocupar NO MÁXIMO 25% da altura total.
Ela não pode avançar para o restante da composição.

Imagem:
${imagemBase}

Sobre a imagem, aplicar DOIS RETÂNGULOS PRETOS SEMITRANSPARENTES:
- Um retângulo no lado esquerdo da imagem
- Um retângulo no lado direito da imagem
Cor preta com transparência leve (20% a 30%).
Os retângulos devem ficar SOBRE a imagem, como camadas.

TEXTOS SOBRE A IMAGEM (OBRIGATÓRIOS):

Canto inferior esquerdo da imagem:
Texto pequeno, branco, alinhado à esquerda:
"${subproduto.toUpperCase()} • ${meses} MESES"

Canto inferior direito da imagem:
Texto PRINCIPAL da campanha, branco, maior que o texto do produto:
"${campanha.textoPrincipal || ''}"

${campanha.textoAuxiliar ? `
Logo abaixo do texto principal:
Texto menor, branco:
"${campanha.textoAuxiliar}"
` : ''}

==================================================
BLOCO 2 — ÁREA DA TABELA (REGIÃO CENTRAL)
==================================================

Fundo preto sólido ocupando toda a largura.

Sobre o fundo preto, centralizar uma tabela com:
- Fundo branco
- Bordas arredondadas
- Alta legibilidade

CABEÇALHO DA TABELA — REGRAS FIXAS (NÃO ALTERAR):

Coluna Crédito:
Fundo #2c3da7, texto branco

Coluna Taxa Adm:
Fundo #000000, texto branco

Coluna Parcela Pessoa Física:
Fundo #1260c7, texto branco

Coluna Parcela Pessoa Jurídica:
Fundo #5691df, texto branco

Ordem das colunas:
${tabela.colunas.join(' | ')}

Linhas da tabela:
${tabela.linhas.map(l => `- ${l}`).join('\n')}

Fonte preta, simples e clara.

==================================================
FAIXA DE LANCES (ABAIXO DA TABELA)
==================================================

Logo abaixo da tabela, criar UM ÚNICO RETÂNGULO HORIZONTAL:
- Mesma largura da tabela
- Cor #2c3da7
- Altura reduzida
- Bordas levemente arredondadas

Dentro deste retângulo:
Todos os textos de lance devem estar NA MESMA LINHA HORIZONTAL,
alinhados entre si,
fonte branca, pequena e em negrito:

${lances.length ? lances.map(l => `• ${l}`).join('   ') : ' '}

==================================================
BLOCO 3 — RODAPÉ (OBRIGATÓRIO)
==================================================

Fundo preto sólido.

Texto legal centralizado,
fonte pequena,
cor cinza-claro:

"${rodape}"

==================================================
TEXTOS OBRIGATÓRIOS — NÃO OMITIR
==================================================

- Produto e meses: "${subproduto} • ${meses} meses"
- Texto da campanha: "${campanha.textoPrincipal || ''}"
- Texto do rodapé legal conforme informado

==================================================
REGRAS FINAIS
==================================================

- Não adicionar elementos extras
- Não mudar cores do cabeçalho
- Não mover a tabela para cima da imagem
- Layout técnico, limpo e organizado
`.trim();
}