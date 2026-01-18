import produtos from '../data/produtos';

/**
 * Constrói o payload final para geração do flyer
 * a partir do context vindo do chatEngine
 */
export function buildFlyerPayload(context) {
  if (!context || !context.area || !context.produto) {
    throw new Error('Contexto inválido para geração do flyer');
  }

  const areaConfig = produtos[context.area];
  if (!areaConfig) {
    throw new Error(`Área não encontrada: ${context.area}`);
  }

  const produtoConfig = areaConfig.produtos[context.produto];
  if (!produtoConfig) {
    throw new Error(`Produto não encontrado: ${context.produto}`);
  }

  // Subproduto (ex: consórcio imóvel, auto, pesados)
  let subprodutoConfig = null;
  if (context.subproduto) {
    subprodutoConfig = produtoConfig.subprodutos?.[context.subproduto];
    if (!subprodutoConfig) {
      throw new Error(`Subproduto não encontrado: ${context.subproduto}`);
    }
  }

  // Prompt base oficial (NUNCA inventar)
  const promptBase =
    subprodutoConfig?.promptBase || produtoConfig.promptBase;

  if (!promptBase) {
    throw new Error('Prompt base não definido para este produto');
  }

  // Texto principal
  const textoPrincipal =
    context.textoPrincipal ||
    produtoConfig.textoPadrao ||
    '';

  // Campanha (quando existir)
  const campanha = context.campanha
    ? `Campanha: ${context.campanha}.`
    : '';

  // Canal influencia apenas enquadramento, não identidade
  const canal = context.canal;

  // Formato final
  const formato = context.formato;

  // Montagem do prompt final (FECHADO E CONTROLADO)
  const promptFinal = `
${promptBase}

Texto principal:
"${textoPrincipal}"

${campanha}

Regras obrigatórias:
- Respeitar integralmente a identidade visual da marca ${areaConfig.nome}
- Paleta de cores fixa: ${areaConfig.paleta.join(', ')}
- Tipografia limpa, institucional e profissional
- NÃO adicionar linhas gráficas atravessando o layout
- NÃO alterar cores, logotipo ou hierarquia visual
- Layout equilibrado, legível e consistente com flyers anteriores
- Adequar composição ao formato ${formato} para ${canal}
`;

  return {
    area: context.area,
    produto: context.produto,
    subproduto: context.subproduto || null,

    formato,
    canal,

    identidadeVisual: {
      marca: areaConfig.nome,
      paleta: areaConfig.paleta
    },

    prompt: promptFinal.trim(),

    meta: {
      geradoEm: new Date().toISOString(),
      origem: 'chat-engine',
      aprovadoAutomaticamente: true
    }
  };
}