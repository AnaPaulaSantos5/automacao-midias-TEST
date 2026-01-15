const planoSaudeFlyer = {
  area: "beneficios",
  produto: "saude",

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

export default planoSaudeFlyer;
