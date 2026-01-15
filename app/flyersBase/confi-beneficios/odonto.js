const planoOdontoFlyer = {
  area: "beneficios",
  produto: "odonto",

  identidade: {
    marca: "Confi Benefícios",
    paleta: {
      primaria: "#f5886c",
      secundaria: "#ffffff",
      texto: "#000000"
    },
    logo: "/logos/confi-beneficios.png"
  },

  formatosPermitidos: {
    instagram: {
      feed: { width: 1080, height: 1080 },
      story: { width: 1080, height: 1920 }
    },
    whatsapp: {
      padrao: { width: 1080, height: 1920 }
    }
  },

  camposObrigatorios: [
    "produto"
  ],

  comportamento: {
    possuiTabela: false,
    exigePerguntas: false
  }
};

export default planoOdontoFlyer;
