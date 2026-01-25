/**
 * PROMPT BASE – CONFI FINANÇAS
 * PRODUTO: CONSÓRCIO COM TABELA
 *
 * ESTE PROMPT É RÍGIDO.
 * NÃO PERMITE REINTERPRETAÇÃO DE LAYOUT.
 * NÃO PERMITE ALTERAÇÃO DE PROPORÇÕES.
 */

export default function consorcioPrompt({
  tipoConsorcio,        // "automovel" | "imovel" | "pesados"
  meses,                // número (ex: 90)
  destaqueCampanha,     // string
  tabela,               // { colunas: [], linhas: [] }
  lances,               // array de strings
  textoLegal             // string
}) {
  return `
GERE UMA IMAGEM DE FLYER PUBLICITÁRIO SEGUINDO EXATAMENTE AS REGRAS ABAIXO.
NÃO INVENTE ELEMENTOS.
NÃO ALTERE PROPORÇÕES.
NÃO MUDE CORES.
NÃO ADICIONE TEXTO NÃO INFORMADO.

=============================
IDENTIDADE DA MARCA
=============================

Marca: Confi Finanças
Estilo: institucional, limpo, profissional, corporativo
Fonte: Causten ou fonte sans-serif moderna equivalente
Qualidade: alta resolução, composição precisa

=============================
FORMATO DO FLYER
=============================

• Flyer vertical
• Proporção aproximada: 4:5
• Margens internas bem definidas
• Nada pode ficar cortado

=============================
LAYOUT OBRIGATÓRIO
=============================

O flyer é dividido em DUAS GRANDES ÁREAS VERTICAIS:

────────────────────────────
1) TOPO – 30% DA ALTURA TOTAL
────────────────────────────

• Imagem fotográfica ocupando APENAS os 30% superiores
• A imagem NÃO pode ultrapassar essa área

Imagem de acordo com o tipo de consórcio:
- Automóvel: carro simples, moderno, em ambiente urbano
- Imóvel: casa moderna, arquitetura contemporânea
- Pesados: caminhão na estrada

• Aplicar overlays pretos MUITO SUAVES nas laterais
• Overlays ocupam entre 20% e 30% da largura da imagem
• Centro da imagem permanece visível

Textos sobre a imagem:
• Posicionados próximos ao final da imagem, acima da tabela
• Cor branca (#FFFFFF)
• Tipografia clara e legível
• Conteúdo:
  - Tipo do consórcio
  - Prazo: ${meses} meses
  - Destaque da campanha: ${destaqueCampanha}

────────────────────────────
2) ÁREA INFERIOR – 70% DA ALTURA TOTAL
────────────────────────────

• Fundo PRETO sólido (#000000)
• Nenhuma imagem nesta área

Dentro desta área existem TRÊS BLOCOS:

────────────────────────────
BLOCO CENTRAL – TABELA
────────────────────────────

• Tabela centralizada
• Fundo branco (#FFFFFF)
• Bordas arredondadas
• Excelente contraste e leitura
• A tabela é o ELEMENTO PRINCIPAL do flyer

Cabeçalho da tabela (texto branco #FEFEFE):

Coluna 1 – Crédito
• Fundo: #2c3da7

Coluna 2 – Taxa Adm
• Fundo: #000000

Coluna 3 – Parcela Pessoa Física
• Fundo: #1260c7

Coluna 4 – Parcela Pessoa Jurídica
• Fundo: #5691df

Conteúdo da tabela:
${tabela.colunas.join(' | ')}
${tabela.linhas.map(l => l.join(' | ')).join('\n')}

• Texto das linhas: preto
• Fonte clara, objetiva e legível
• Espaçamento confortável entre linhas

────────────────────────────
BLOCO DE LANCES (ABAIXO DA TABELA)
────────────────────────────

• Retângulo horizontal
• Cor: #2c3da7
• Mesma largura da tabela
• Altura reduzida

Texto:
• Cor branca
• Fonte Causten em negrito
• Conteúdo:
${lances.join(' | ')}

────────────────────────────
RODAPÉ – TEXTO LEGAL
────────────────────────────

• Fonte pequena
• Cor cinza-claro
• Alinhamento central

Texto:
"${textoLegal}"

=============================
REGRAS FINAIS (OBRIGATÓRIAS)
=============================

• NÃO adicionar selos, ícones, efeitos extras ou elementos gráficos
• NÃO alterar proporções
• NÃO reinterpretar layout
• NÃO criar variações visuais
• Executar exatamente conforme descrito
`;
}