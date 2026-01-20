export function gerarPrompt(state) {
  if (!state || !state.area) {
    throw new Error('State inválido');
  }

  const {
    produto,
    area,
    subproduto,
    meses,
    campanha,
    tabela,
    textoPrincipal,
    textoComplementar
  } = state;

  /* ======================================================
     CONFI FINANÇAS — CONSÓRCIO
  ====================================================== */
  if (produto === 'financas' || area === 'confi-financas') {
    const imagemBase =
      subproduto === 'imovel'
        ? 'Casa moderna ao entardecer, arquitetura contemporânea, iluminação quente, estilo premium'
        : subproduto === 'automovel'
        ? 'Carro atual em estrada, cenário com casas ao fundo, estética realista'
        : 'Caminhão moderno em estrada cercada por árvores, fotografia profissional';

    return `
Flyer vertical premium – Confi Finanças | Consórcio ${subproduto}

IDENTIDADE VISUAL (FIXA – NÃO ALTERAR)
Paleta:
• Azul principal #1260c7
• Branco #ffffff
• Preto #000000
Estética institucional, corporativa e premium.

IMAGEM DE FUNDO
${imagemBase}
Imagem realista, bem iluminada, sem interferência visual.
Logotipo da Confi Finanças no canto superior esquerdo.

CABEÇALHO
Título grande, branco, alinhado à esquerda:
“Consórcio ${subproduto === 'imovel' ? 'Imóvel' : subproduto === 'automovel' ? 'Automóvel' : 'Pesados'}”
Subtítulo logo abaixo:
“${meses} meses”

DESTAQUE DE CAMPANHA (LATERAL DIREITA)
Texto principal grande, branco:
“${campanha.textoPrincipal}”
Texto auxiliar logo abaixo:
“${campanha.textoAuxiliar}”
Alinhamento à direita.

BLOCO CENTRAL – TABELA (ELEMENTO PRINCIPAL)
Tabela com fundo branco e bordas arredondadas.

Cabeçalho da tabela – CORES FIXAS:
• Crédito → fundo #2c3da7 | texto branco
• Taxa Adm → fundo #000000 | texto branco
• Parcela Pessoa Física → fundo #1260c7 | texto branco
• Parcela Pessoa Jurídica → fundo #5691df | texto branco

Colunas:
${tabela.colunas.join(' | ')}

Linhas (valores definidos pelo usuário):
${tabela.linhas.map(l => `• ${l}`).join('\n')}

Fonte preta, clara, legível, sem estilização criativa.

RODAPÉ LEGAL
Texto pequeno, cinza-claro, centralizado.
Conteúdo variável conforme campanha informada pelo usuário.

RESULTADO FINAL
Flyer institucional, organizado, altamente legível, com foco em conversão e clareza financeira.
`.trim();
  }

  /* ======================================================
     CONFI SEGUROS — GERAL / RESIDENCIAL
  ====================================================== */
  if (area === 'confi-seguros') {
    return `
Flyer vertical – Confi Seguros | Seguro ${subproduto}

IDENTIDADE VISUAL (FIXA)
Paleta:
• Amarelo institucional #ffce0a
• Branco #ffffff
• Preto #000000
Estética clean, iluminada, minimalista.

IMAGEM DE FUNDO (ESCOLHER UMA VARIAÇÃO)
• Pessoa jovem relaxada em ambiente acolhedor
OU
• Grupo de amigos ao ar livre com luz decorativa
OU
• Pessoa trabalhando em notebook com café, ambiente minimalista e seguro

MENSAGEM CENTRAL (VARIÁVEL COM NORTE)
Frase institucional superior:
Texto deve transmitir segurança, tranquilidade e confiança.
Exemplo de estrutura (não copiar literalmente):
“Seu patrimônio seguro, sua …”

Alinhamento central, tipografia branca moderna.
Palavra “seguro” em destaque por peso da fonte.

DESTAQUE EMOCIONAL (FIXO)
Texto grande central:
“Tranquilidade”
Fonte branca muito grande.
Dentro de moldura arredondada com contorno amarelo #ffce0a.

TEXTO COMPLEMENTAR
Abaixo do destaque:
“garantida”
Fonte branca média, centralizada.

RODAPÉ (SE ATIVADO NO STATE)
Vinheta escura para legibilidade.
• WhatsApp (41) 99973-3350 – 24h
• Telefone (41) 3019-7500
• Instagram @confi_seguros
Ícones amarelos, alinhados horizontalmente.

CTA
Botão arredondado no canto inferior direito.
Fundo cinza claro.
Texto branco:
“Entre em contato!”

RESULTADO
Flyer emocional, institucional e altamente coerente com a identidade Confi Seguros.
`.trim();
  }

  /* ======================================================
     CONFI BENEFÍCIOS — ODONTO
  ====================================================== */
  if (area === 'confi-beneficios' && subproduto === 'odonto') {
    return `
Flyer vertical – Confi Benefícios | Seguro Odonto

ESTÉTICA FIXA
Visual leve, amigável e moderno.
Paleta coral #f5886c como base.

FUNDO
Degradê coral homogêneo.
Bordas superiores arredondadas.

TEXTO PRINCIPAL (VARIÁVEL COM NORTE)
Bloco à esquerda, fonte branca.
Frase 1: emocional, autoestima e bem-estar (exemplo de tom).
Frase 2: benefício, praticidade e segurança.
Palavras-chave podem estar em negrito por peso de fonte.

LISTA DE BENEFÍCIOS
Cards arredondados em bege rosado claro.
Ícone de check preto.
Itens definidos pelo usuário.

IMAGEM
Pessoa sorrindo amplamente no lado direito.
Roupa branca, expressão leve e confiante.

ELEMENTO GRÁFICO
Curva coral orgânica no canto inferior direito.

RESULTADO
Flyer emocional, humano e coerente com Confi Benefícios.
`.trim();
  }

  /* ======================================================
     CONFI BENEFÍCIOS — SAÚDE
  ====================================================== */
  if (area === 'confi-beneficios' && subproduto === 'saude') {
    return `
Flyer vertical – Confi Benefícios | Seguro Saúde

ESTÉTICA FIXA
Clean, arejada, minimalista.
Predominância de branco e coral.

FUNDO
Branco com faixa lateral direita de blocos verticais arredondados em tons de coral e pêssego.

CABEÇALHO
Linha horizontal fina coral + texto:
“Seguro Saúde”
Palavra “Saúde” em negrito por peso da fonte.

TEXTO PRINCIPAL (VARIÁVEL COM NORTE)
Texto alinhado à esquerda em coral.
Deve transmitir cuidado, acesso, segurança e proximidade.
Palavras-chave podem ser enfatizadas.

IMAGEM
Duas mulheres (jovem e idosa) em situação de cuidado/alongamento.
Foto recortada sobre a faixa coral.
Curva coral envolvendo parcialmente as pessoas.

RODAPÉ
Logotipo Confi Benefícios no canto inferior esquerdo.

RESULTADO
Flyer humano, profissional e acolhedor.
`.trim();
  }

  /* ======================================================
     CONFI BENEFÍCIOS — PET
  ====================================================== */
  if (area === 'confi-beneficios' && subproduto === 'pet') {
    return `
Flyer vertical – Confi Benefícios | Seguro Pet

ESTÉTICA FIXA
Leve, alegre e amigável.
Grande presença de coral.

FUNDO
Branco minimalista com elementos decorativos em coral.

CABEÇALHO
Texto central:
“Seguro Pet”
“Seguro” em coral claro.
“Pet” em coral forte e negrito.
Linhas horizontais finas em coral nas laterais.

TEXTO PRINCIPAL (VARIÁVEL COM NORTE)
Bloco esquerdo em coral.
Frase 1: cuidado e facilidade.
Frase 2: proteção e suporte nos momentos importantes.
Palavras-chave podem estar em negrito.

IMAGEM
Cachorro labrador sorridente com pata levantada.
Fundo gráfico de pata coral.
Traço curvo coral em estilo arco de proteção.

RODAPÉ
Logotipo Confi Benefícios no canto inferior esquerdo.

RESULTADO
Flyer emocional, simpático e coerente com a identidade da marca.
`.trim();
  }

  throw new Error('Combinação de produto não suportada');
}