import identidades from "../flyersBase/index";

export function buildFlyerPayload(contexto) {
  const identidade = identidades[contexto.area];

  const dimensoes = {
    instagram: {
      feed: "1080x1080",
      "feed-vertical": "1080x1350",
      stories: "1080x1920"
    },
    whatsapp: {
      status: "1080x1920",
      quadrado: "1080x1080"
    }
  };

  return {
    produto: {
      area: contexto.area,
      tipo: contexto.tipo,
      subtipo: contexto.subtipo
    },

    canal: {
      nome: contexto.canal,
      formato: contexto.formato,
      dimensao: dimensoes[contexto.canal][contexto.formato]
    },

    campanha: {
      titulo: gerarTitulo(contexto),
      destaque: contexto.campanha || "Sem campanha"
    },

    identidadeVisual: identidade,

    regrasCriacao: {
      usarTemplateBase: true,
      manterIdentidadeVisual: true,
      evitarElementosNaoPadrao: true
    },

    origem: {
      criadoVia: "chat",
      dataCriacao: new Date().toISOString()
    }
  };
}

function gerarTitulo(contexto) {
  if (contexto.tipo === "consorcio") {
    return `Consórcio ${capitalize(contexto.subtipo)}`;
  }
  if (contexto.tipo === "seguro") {
    return `Seguro ${capitalize(contexto.subtipo)}`;
  }
  return "Flyer Confi";
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
