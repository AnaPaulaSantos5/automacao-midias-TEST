const financiamentoFlyer = {
  area: "financas",
  produto: "financiamento",

  identidade: {
    marca: "Confi Finanças",
    paleta: {
      primaria: "#1260c7",
      secundaria: "#ffffff",
      texto: "#000000"
    }
  },

  formatosPermitidos: {
    instagram: {
      feed: { width: 1080, height: 1080 }
    }
  },

  camposObrigatorios: ["produto"],

  comportamento: {
    possuiTabela: false,
    exigePerguntas: false
  }
};

export default financiamentoFlyer;
