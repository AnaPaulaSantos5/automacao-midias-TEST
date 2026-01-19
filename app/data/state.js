export const initialState = {
  etapa: 'START',

  // Produto principal
  produto: null,
  area: null,

  // Consórcio
  subproduto: null,
  meses: null,
  campanha: null,
  tabela: {
    colunas: [],
    linhas: []
  },

  // Textos
  textoPrincipal: null,
  textoComplementar: null,

  // Controle
  formato: null,
  canal: null,

  // Flags
  aceitaTabela: false,
  aceitaCampanha: false
};