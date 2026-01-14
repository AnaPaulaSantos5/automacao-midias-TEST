const consorcioFlyer = {
  area: "financas",
  tipo: "consorcio",

  identidade: {
    marca: "Confi Finanças",
    paleta: {
      primaria: "#1260c7",
      secundaria: "#ffffff",
      texto: "#000000"
    },
    logo: "/logos/confi-financas.png"
  },

  formatosPermitidos: {
    instagramFeed: {
      width: 1080,
      height: 1080
    },
    instagramStory: {
      width: 1080,
      height: 1920
    },
    whatsapp: {
      width: 1080,
      height: 1920
    }
  },

  camposObrigatorios: [
    "produto",
    "valorCarta",
    "prazo",
    "parcelaInicial"
  ],

  comportamento: {
    possuiTabela: true,
    exigePerguntas: true
  }
};

export default consorcioFlyer;
