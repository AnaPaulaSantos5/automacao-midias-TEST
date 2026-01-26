export const estadoInicial = {
  etapa: 'inicio',

  area: null,           // seguros | financas | beneficios
  produto: null,        // consorcio | seguro | beneficio
  subproduto: null,     // imovel | auto | pet | odonto | saude etc
  prazo: null,          // meses

  campanha: {
    textoPrincipal: null,
    textoAuxiliar: null
  },

  tabela: {
    colunas: [],
    linhas: []
  },

  extras: [],           // lances, destaques
  rodape: null,

  prontoParaGerar: false
};