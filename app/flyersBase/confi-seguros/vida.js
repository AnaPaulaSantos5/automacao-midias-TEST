const seguroVidaFlyer = {
  area: "seguros",
  produto: "vida",

  identidade: {
    marca: "Confi Seguros",
    paleta: {
      primaria: "#ffce0a",
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

export default seguroVidaFlyer;
