export const initialState = {
  etapa: 'START',

  // Produto e área
  produto: null, // ex: { key: 'consorcio', area: 'confi-financas' }
  subtipo: null, // imovel | automovel | pesados | residencial | odonto | saude | pet

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