export function gerarPrompt(state) {
  if (!state || !state.area) {
    throw new Error('State inválido');
  }

  const { area, produto, subproduto } = state;

  /* ======================================================
     CONFI FINANÇAS — CONSÓRCIO (IMAGEM BASE)
  ====================================================== */
  if (area === 'confi-financas' && produto === 'financas') {
    let descricaoImagem = '';

    if (subproduto === 'imovel') {
      descricaoImagem = `
Fotografia realista de uma casa moderna,
arquitetura contemporânea brasileira,
ambiente residencial real,
iluminação natural suave,
sensação de conquista e estabilidade,
sem pessoas em destaque,
sem texto,
sem elementos gráficos,
estilo fotografia profissional.
`;
    }

    if (subproduto === 'automovel') {
      descricaoImagem = `
Fotografia realista de um carro atual,
modelo popular ou médio,
em ambiente urbano ou estrada,
luz natural,
sensação de conquista e mobilidade,
sem pessoas em destaque,
sem texto,
sem elementos gráficos,
estilo fotografia profissional.
`;
    }

    if (subproduto === 'pesados') {
      descricaoImagem = `
Fotografia realista de um caminhão moderno,
em estrada brasileira,
cenário real,
luz natural,
sensação de trabalho e crescimento,
sem pessoas em destaque,
sem texto,
sem elementos gráficos,
estilo fotografia profissional.
`;
    }

    return `
${descricaoImagem}

A imagem deve:
- parecer uma fotografia real
- não conter textos, números ou gráficos
- não conter logotipos
- não conter molduras
- não conter overlays
- ser limpa e bem iluminada
- permitir recorte vertical (9:16) e quadrado (1:1)
`.trim();
  }

  /* ======================================================
     CONFI SEGUROS — RESIDENCIAL / GERAL
  ====================================================== */
  if (area === 'confi-seguros') {
    return `
Fotografia realista de pessoas dentro de casa,
ambiente residencial acolhedor,
família ou casal em momento cotidiano real,
luz natural suave,
sensação de segurança, conforto e tranquilidade,
sem poses forçadas,
sem texto,
sem elementos gráficos,
estilo fotografia profissional.

A imagem deve:
- parecer uma fotografia real
- não conter textos ou logotipos
- não conter molduras ou overlays
- permitir recorte vertical e quadrado
`.trim();
  }

  /* ======================================================
     CONFI BENEFÍCIOS — ODONTO
  ====================================================== */
  if (area === 'confi-beneficios' && subproduto === 'odonto') {
    return `
Fotografia realista de pessoas sorrindo,
momentos naturais de lazer,
família ou amigos,
expressão leve e espontânea,
ambiente externo ou interno real,
sem poses publicitárias,
sem texto,
sem elementos gráficos,
estilo fotografia profissional.

A imagem deve:
- parecer uma fotografia real
- não conter textos ou logotipos
- permitir recorte vertical e quadrado
`.trim();
  }

  /* ======================================================
     CONFI BENEFÍCIOS — SAÚDE
  ====================================================== */
  if (area === 'confi-beneficios' && subproduto === 'saude') {
    return `
Fotografia realista de pessoas em atividades leves,
caminhada, bicicleta ou parque,
momento cotidiano e saudável,
luz natural,
sensação de bem-estar e qualidade de vida,
sem texto,
sem elementos gráficos,
estilo fotografia profissional.

A imagem deve:
- parecer uma fotografia real
- não conter textos ou logotipos
- permitir recorte vertical e quadrado
`.trim();
  }

  /* ======================================================
     CONFI BENEFÍCIOS — PET
  ====================================================== */
  if (area === 'confi-beneficios' && subproduto === 'pet') {
    return `
Fotografia realista de pessoas com seus pets,
interação natural e afetuosa,
ambiente real,
expressões espontâneas,
sem poses forçadas,
sem texto,
sem elementos gráficos,
estilo fotografia profissional.

A imagem deve:
- parecer uma fotografia real
- não conter textos ou logotipos
- permitir recorte vertical e quadrado
`.trim();
  }

  throw new Error('Combinação não suportada para geração de imagem');
}
