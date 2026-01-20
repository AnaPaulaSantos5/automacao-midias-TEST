// app/utils/state.js
export const initialState = {
  etapa: 'START',

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

  // Flags
  aceitaTabela: false,
  aceitaCampanha: false
},
  /* =========================
     CONFI FINANÇAS — CONSÓRCIO
  ========================= */
  meses: null,

  campanha: {
    textoPrincipal: null, // ex: "Parcelas 40%"
    textoAuxiliar: null   // ex: "menores até a contemplação"
  },

  tabela: {
    colunas: [], // SEMPRE fixas no prompt, aqui só confirmação
    linhas: []   // valores escolhidos pelo usuário
  },

  /* =========================
     TEXTOS (SEGUROS / BENEFÍCIOS)
  ========================= */
  frases: {
    modo: null, // 'auto' | 'manual'

    // Seguro
    institucional: null,
    destaque: null,
    complementar: null,

    // Benefícios (odonto / saúde / pet)
    bloco1: null,
    bloco2: null
  },

  /* =========================
     CONTROLE
  ========================= */
  incluirRodape: true,
  formato: null, // feed | story | etc
  canal: null,   // instagram | whatsapp | etc
};