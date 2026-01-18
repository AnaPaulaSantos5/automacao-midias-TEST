export function buildPrompt(context) {
  return `
Crie um flyer seguindo EXATAMENTE esta identidade visual:

Marca: ${context.produto.identidadeVisual.marca}
Paleta: ${context.produto.identidadeVisual.paleta.join(', ')}

Produto: ${context.produto.nomeExibicao}
Canal: ${context.canal}
Formato: ${context.formato}

Texto principal:
${context.textoPrincipal || 'Gerar conforme identidade da marca'}

${context.modelo === 'B' ? `
Tabela:
Colunas: ${context.tabela.colunas.join(' | ')}
Linhas:
${context.tabela.linhas.join('\n')}
` : ''}

Texto complementar:
${context.textoComplementar || 'Gerar conforme identidade visual'}

Texto legal:
${context.textoLegal || 'Gerar conforme regras da campanha'}
`;
}