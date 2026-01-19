export function gerarPrompt(context) {
  if (!context || !context.produto) {
    throw new Error('Contexto inválido');
  }

  const {
    produto,
    subtipo,
    campanha,
    meses,
    colunas,
    linhas,
    frases,
    rodape,
    beneficios
  } = context;

  /* ======================================================
     CONFI FINANÇAS — CONSÓRCIO
  ====================================================== */
  if (produto.key === 'consorcio') {
    const imagem =
      subtipo === 'imovel'
        ? 'Casa moderna de alto padrão ao entardecer, arquitetura contemporânea, iluminação quente, estética premium'
        : subtipo === 'automovel'
        ? 'Carro moderno e simples em estrada com casas ao fundo, cenário urbano leve'
        : 'Caminhão moderno em estrada cercada por árvores, cenário amplo e profissional';

    return `
Flyer de Campanha – Confi Finanças | Consórcio ${subtipo}

REGRA ABSOLUTA
Este layout é FIXO. Não reinterpretar, não reorganizar e não alterar cores ou hierarquia.

IDENTIDADE VISUAL
• Paleta fixa:
  - Azul #1260c7
  - Branco #ffffff
  - Preto #000000
• Estilo corporativo, premium e institucional.

IMAGEM DE FUNDO
• ${imagem}
• Logotipo Confi Finanças no canto superior esquerdo.

CABEÇALHO
• Título grande, branco, alinhado à esquerda:
"Consórcio ${subtipo === 'imovel' ? 'Imóvel' : subtipo === 'automovel' ? 'Automóvel' : 'Pesados'}"
• Subtítulo logo abaixo, branco:
"${meses} meses"

DESTAQUE DE CAMPANHA — LATERAL DIREITA
• Texto grande (branco):
"${campanha.textoPrincipal}"
• Texto auxiliar abaixo (branco):
"${campanha.textoAuxiliar}"
• Ambos alinhados à direita.

TABELA CENTRAL (ELEMENTO PRINCIPAL)
• Fundo branco com bordas arredondadas.

CABEÇALHO DA TABELA — CORES FIXAS (NÃO VARIAR)
• Crédito → fundo #2c3da7 | texto branco
• Taxa Adm → fundo #000000 | texto branco
• Parcela Pessoa Física → fundo #1260c7 | texto branco
• Parcela Pessoa Jurídica → fundo #5691df | texto branco

TÍTULOS DAS COLUNAS (FIXOS)
${colunas.map(c => `• ${c}`).join('\n')}

LINHAS DA TABELA (VALORES DO USUÁRIO)
${linhas.map(l => `• ${l}`).join('\n')}

• Fonte preta, clara e legível.

RODAPÉ LEGAL
• Texto pequeno, cinza-claro, centralizado.
• Conteúdo fornecido pelo usuário:
"${rodape}"

RESULTADO
Flyer institucional, focado em conversão, clareza financeira e credibilidade.
    `.trim();
  }

  /* ======================================================
     CONFI SEGUROS — FLYER GERAL / RESIDENCIAL
  ====================================================== */
  if (produto.area === 'confi-seguros') {
    return `
Flyer – Confi Seguros | Seguro ${subtipo}

REGRA ABSOLUTA
Estrutura visual fixa conforme manual Confi Seguros.

IDENTIDADE VISUAL
• Amarelo #ffce0a
• Branco #ffffff
• Preto #000000

IMAGEM DE FUNDO
• Fotografia emocional seguindo UMA das opções:
  - Pessoa jovem relaxada em ambiente acolhedor
  - Grupo de amigos ao ar livre com luz decorativa
  - Pessoa trabalhando em notebook com café em ambiente minimalista
• A imagem deve transmitir conforto, proteção e tranquilidade.

MENSAGEM PRINCIPAL
• Frase institucional superior:
"${frases.institucional}"
• Fonte branca, centralizada.
• Palavra relacionada a segurança em destaque por peso de fonte.

DESTAQUE CENTRAL
• Texto grande:
"${frases.destaque}"
• Fonte branca muito grande.
• Envolvido por moldura arredondada com contorno amarelo #ffce0a.

TEXTO COMPLEMENTAR
• Abaixo do destaque:
"${frases.complementar}"
• Fonte branca média, centralizada.

RODAPÉ
• Vinheta escura para legibilidade.
• Itens alinhados horizontalmente:
  - WhatsApp (41) 99973-3350 – 24h
  - Telefone (41) 3019-7500
  - Instagram confi_seguros
• Ícones amarelos.

CTA
• Canto inferior direito.
• Botão arredondado cinza-claro.
• Texto branco:
"Entre em contato!"

RESULTADO
Flyer institucional focado em segurança, tranquilidade e confiança.
    `.trim();
  }

  /* ======================================================
     CONFI BENEFÍCIOS — ODONTO
  ====================================================== */
  if (produto.area === 'confi-beneficios' && subtipo === 'odonto') {
    return `
Flyer – Confi Benefícios | Seguro Odonto

ESTÉTICA FIXA
• Visual leve, amigável e moderno.
• Fundo em degradê coral #f5886c.

TEXTO PRINCIPAL
• Bloco alinhado à esquerda, fonte branca.
• Frases devem remeter a autoestima, cuidado e bem-estar.
• Palavras-chave podem ser destacadas apenas por peso de fonte.

LISTA DE BENEFÍCIOS (VARIÁVEL PELO USUÁRIO)
${beneficios.map(b => `• ${b}`).join('\n')}

IMAGEM
• Pessoa sorrindo amplamente à direita.
• Roupa branca, expressão confiante.

ELEMENTO GRÁFICO
• Curva coral orgânica no canto inferior direito.

RESULTADO
Flyer emocional, focado em autoestima, cuidado e bem-estar.
    `.trim();
  }

  /* ======================================================
     CONFI BENEFÍCIOS — SAÚDE
  ====================================================== */
  if (produto.area === 'confi-beneficios' && subtipo === 'saude') {
    return `
Flyer – Confi Benefícios | Seguro Saúde

ESTÉTICA
• Fundo branco com faixa lateral direita em blocos arredondados coral.

CABEÇALHO
• Linha horizontal fina coral + texto:
"Seguro Saúde"
• Palavra “Saúde” em negrito.

TEXTO PRINCIPAL
• Texto alinhado à esquerda, coral.
• Linguagem de cuidado, acesso e segurança.
• Palavras-chave destacadas apenas por peso de fonte.

IMAGEM
• Duas mulheres (jovem e idosa) em atividade de alongamento.
• Roupa branca.
• Curva coral envolvendo parcialmente.

RESULTADO
Flyer humano, acolhedor e profissional.
    `.trim();
  }

  /* ======================================================
     CONFI BENEFÍCIOS — PET
  ====================================================== */
  if (produto.area === 'confi-beneficios' && subtipo === 'pet') {
    return `
Flyer – Confi Benefícios | Seguro Pet

ESTÉTICA
• Fundo branco.
• Elementos decorativos em coral.

CABEÇALHO
• Texto central:
"Seguro Pet"
• “Seguro” coral claro | “Pet” coral forte em negrito.
• Linhas finas coral laterais.

TEXTO PRINCIPAL
• Bloco esquerdo, coral.
• Linguagem acolhedora e de proteção ao pet.

IMAGEM
• Cachorro labrador recortado com pata levantada.
• Fundo gráfico de pata coral.
• Traço curvo coral estilo arco de proteção.

RODAPÉ
• Logotipo Confi Benefícios no canto inferior esquerdo.

RESULTADO
Flyer leve, emocional e focado em cuidado com o pet.
    `.trim();
  }

  throw new Error('Produto não suportado');
}