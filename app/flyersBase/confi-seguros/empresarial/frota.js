const seguroFrotaFlyer = {
  area: "seguros",
  produto: "frota",

  segmento: "empresarial",

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

export default seguroFrotaFlyer;
