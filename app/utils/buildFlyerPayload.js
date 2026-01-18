export function buildFlyerPayload(context) {
  return {
    produto: {
      key: context.produto.key,
      nome: context.produto.nomeExibicao,
      area: context.produto.area,
      identidadeVisual: context.produto.identidadeVisual
    },

    canal: context.canal,
    formato: context.formato,

    modelo: context.modelo || 'A',

    consorcio: context.produto.key === 'consorcio'
      ? {
          tipo: context.subproduto || null,
          campanha: context.campanha || null,
          textoPrincipal: context.textoPrincipal || null
        }
      : null,

    textos: {
      principal: context.textoPrincipal || null,
      complementar: context.textoComplementar || null,
      legal: context.textoLegal || null
    },

    tabela: context.modelo === 'B'
      ? {
          colunas: context.tabela?.colunas || [],
          linhas: context.tabela?.linhas || []
        }
      : null,

    status: {
      aprovado: false,
      criadoEm: new Date().toISOString()
    }
  };
}