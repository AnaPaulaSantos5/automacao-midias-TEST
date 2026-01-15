const consorcioFlyer = {
  area: "financas",
  produto: "consorcio",

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
    "subtipo",          // auto | imovel | pesados
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
