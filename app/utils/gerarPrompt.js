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
     CONFI FINANÇAS — CONSÓRCIO (PROMPT FECHADO PRODUÇÃO)
  ====================================================== */
  if (produto === 'financas' || area === 'confi-financas') {
    const imagemBase =
      subproduto === 'imovel'
        ? 'Casa moderna ao entardecer, arquitetura contemporânea, iluminação quente, estilo premium'
        : subproduto === 'automovel'
        ? 'Carro atual em estrada urbana, cenário realista, estética institucional'
        : 'Caminhão moderno em estrada, fotografia profissional, cenário corporativo';

    return `
CONTEXTO
Você está gerando um flyer institucional da marca Confi Finanças para campanha de Consórcio.
Este layout é PADRONIZADO e NÃO DEVE sofrer variações criativas.

IDENTIDADE VISUAL (OBRIGATÓRIO)
Marca: Confi Finanças
Paleta fixa:
- Azul principal: #1260C7
- Branco: #FFFFFF
- Preto: #000000
Estilo: institucional, corporativo, profissional, clean.

LAYOUT ESTRUTURAL (REGRA ABSOLUTA)
Flyer vertical dividido EXATAMENTE em 3 áreas fixas.
É PROIBIDO misturar áreas.

==============================
1) TOPO — 30% DA ALTURA TOTAL
==============================
- Contém APENAS imagem fotográfica.
- Tema da imagem:
${imagemBase}
- A imagem:
  - Ocupa SOMENTE o topo
  - NÃO pode invadir o meio
  - NÃO pode invadir o fundo
- NÃO adicionar textos sobre a imagem.
- NÃO adicionar logotipo.
- NÃO adicionar overlays.

==============================
2) MEIO — 50% DA ALTURA TOTAL
==============================
- Bloco BRANCO sólido (#FFFFFF)
- Bordas arredondadas
- Fundo totalmente branco
- Contém EXCLUSIVAMENTE a tabela principal

TABELA (PADRÃO FIXO)
- Cabeçalho:
  - Fundo #1260C7
  - Texto branco #FFFFFF
- Corpo:
  - Fundo branco
  - Texto preto #000000
- Colunas (usar EXATAMENTE):
${tabela.colunas.join(' | ')}

- Linhas (usar EXATAMENTE, sem duplicar, sem inventar):
${tabela.linhas.map(l => `- ${l}`).join('\n')}

- Fonte clara, legível, sem estilização criativa.
- NÃO adicionar colunas.
- NÃO remover colunas.
- NÃO alterar valores.

TEXTO DO PRODUTO (ACIMA DA TABELA, DENTRO DO BLOCO BRANCO)
- Produto:
Consórcio ${subproduto === 'imovel' ? 'Imóvel' : subproduto === 'automovel' ? 'Automóvel' : 'Pesados'}

- Prazo:
${meses} meses

- Destaque da campanha:
Texto principal:
"${campanha.textoPrincipal}"

Texto auxiliar:
"${campanha.textoAuxiliar}"

- Alinhamento central.
- Hierarquia clara.
- NÃO repetir dados da tabela.

==============================
3) FUNDO — 20% DA ALTURA TOTAL
==============================
- Fundo PRETO sólido (#000000)
- NÃO usar imagem.
- NÃO usar gradiente.
- NÃO usar textura.

RODAPÉ LEGAL (CONDICIONAL)
- O rodapé SÓ DEVE EXISTIR se um texto legal for explicitamente informado.
- Se NÃO houver texto legal:
  - NÃO renderizar texto
  - NÃO usar frases genéricas
  - NÃO usar placeholders como "texto legal" ou "condições"

RESTRIÇÕES ABSOLUTAS
- NÃO inventar textos
- NÃO criar slogans
- NÃO inserir CTA
- NÃO inserir logotipo
- NÃO usar ícones
- NÃO usar mockups
- NÃO reinterpretar layout
- NÃO preencher espaços vazios automaticamente

OBJETIVO FINAL
Gerar um flyer:
- Padronizado
- Repetível
- Consistente
- Institucional
- Sem variações criativas de estrutura

Este layout deve ser respeitado mesmo que reduza impacto visual.
Prioridade absoluta: CONSISTÊNCIA E PADRONIZAÇÃO.
`.trim();
  }

  /* ======================================================
     CONFI SEGUROS — (MANTIDO COMO ESTÁ POR ENQUANTO)
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

IMAGEM DE FUNDO
Pessoa em ambiente residencial, transmitindo tranquilidade.

MENSAGEM CENTRAL
Frase institucional transmitindo proteção e tranquilidade.

RODAPÉ (SE ATIVADO NO STATE)
WhatsApp, Telefone e Instagram.

CTA
Botão “Entre em contato!”

RESULTADO
Flyer institucional e emocional.
`.trim();
  }

  /* ======================================================
     CONFI BENEFÍCIOS — ODONTO (MANTIDO)
  ====================================================== */
  if (area === 'confi-beneficios' && subproduto === 'odonto') {
    return `
Flyer vertical – Confi Benefícios | Seguro Odonto

Visual leve, amigável e moderno.
Paleta coral #f5886c.

Imagem de pessoas sorrindo.
Texto emocional sobre cuidado com o sorriso.

Lista de benefícios.

Resultado humano e acolhedor.
`.trim();
  }

  /* ======================================================
     CONFI BENEFÍCIOS — SAÚDE (MANTIDO)
  ====================================================== */
  if (area === 'confi-beneficios' && subproduto === 'saude') {
    return `
Flyer vertical – Confi Benefícios | Seguro Saúde

Imagem de pessoas em atividades saudáveis.
Texto sobre autocuidado e qualidade de vida.

Resultado clean e profissional.
`.trim();
  }

  /* ======================================================
     CONFI BENEFÍCIOS — PET (MANTIDO)
  ====================================================== */
  if (area === 'confi-beneficios' && subproduto === 'pet') {
    return `
Flyer vertical – Confi Benefícios | Seguro Pet

Imagem de pessoas com pets.
Texto sobre cuidado e proteção aos animais.

Resultado leve e emocional.
`.trim();
  }

  throw new Error('Combinação de produto não suportada');
}