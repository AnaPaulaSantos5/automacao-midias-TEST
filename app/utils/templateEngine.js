export function templateFinancas(estado) {
  return {
    marca: 'Confi Finanças',
    paleta: ['#1260c7', '#ffffff', '#000000'],
    formato: 'instagram-feed',

    layout: 'consorcio-com-tabela',

    imagem: {
      tema: estado.subproduto,
      overlays: true,
      protecaoContorno: {
        ativo: true,
        cor: '#1260c7',
        espessura: '5px'
      }
    },

    textos: {
      titulo: estado.campanha.textoPrincipal,
      subtitulo: estado.campanha.textoAuxiliar
    },

    tabela: {
      colunas: estado.tabela.colunas,
      linhas: estado.tabela.linhas,
      cores: [
        '#2c3da7',
        '#000000',
        '#1260c7',
        '#5691df'
      ]
    },

    lances: estado.extras,

    rodape: estado.rodape,

    contato: {
      whatsapp: '(41) 99973-3350',
      telefone: '(41) 3019-7500',
      instagram: '@confi_seguros'
    },

    cta: false // consórcio com tabela não tem CTA
  };
}