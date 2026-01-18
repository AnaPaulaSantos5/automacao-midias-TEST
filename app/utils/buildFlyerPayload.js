export function buildFlyerPayload(context) {
  const { produto, canal, formato, textoPrincipal, tabela, subtipo } = context;

  let prompt = `
Crie um flyer seguindo EXATAMENTE esta identidade visual:

Marca: ${produto.identidadeVisual.marca}
Paleta: ${produto.identidadeVisual.paleta.join(', ')}
Canal: ${canal}
Formato: ${formato}
Produto: ${produto.nomeExibicao}${subtipo ? ' - ' + subtipo : ''}

Texto principal:
${textoPrincipal || 'Gerar texto conforme briefing institucional da marca.'}
`;

  if (tabela) {
    prompt += `
Tabela central com colunas:
${tabela.colunas.join(' | ')}

Valores:
${tabela.linhas.join('\n')}
`;
  }

  return { prompt };
}