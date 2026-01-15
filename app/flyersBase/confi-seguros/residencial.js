const seguroResidencialFlyer = {
  area: "seguros",
  produto: "residencial",

  identidade: {
    marca: "Confi Seguros",
    paleta: {
      primaria: "#ffce0a",
      secundaria: "#ffffff",
      texto: "#000000"
    },
    logo: "/logos/confi-seguros.png"
  },

  formatosPermitidos: {
    instagram: {
      feed: { width: 1080, height: 1080 },
      feedVertical: { width: 1080, height: 1350 },
      story: { width: 1080, height: 1920 }
    },
    whatsapp: {
      padrao: { width: 1080, height: 1920 }
    }
  },

  camposObrigatorios: [
    "produto",
    "beneficios"
  ],

  comportamento: {
    possuiTabela: false,
    exigePerguntas: true
  }
};

export default seguroResidencialFlyer;
