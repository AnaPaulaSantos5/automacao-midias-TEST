export function chatEngine(mensagem, estado) {
  const texto = mensagem.toLowerCase().trim();

  // INÍCIO
  if (estado.etapa === 'inicio') {
    estado.etapa = 'area';
    return {
      resposta: 'Olá! Qual área deseja? Seguros, Finanças ou Benefícios?',
      estado
    };
  }

  // ÁREA
  if (estado.etapa === 'area') {
    if (texto.includes('fin')) {
      estado.area = 'financas';
      estado.etapa = 'produto';
      return { resposta: 'Perfeito. Qual produto? Consórcio?', estado };
    }
  }

  // PRODUTO
  if (estado.etapa === 'produto') {
    estado.produto = 'consorcio';
    estado.etapa = 'subproduto';
    return {
      resposta: 'Qual o tipo de consórcio? Imóvel, Automóvel ou Pesados?',
      estado
    };
  }

  // SUBPRODUTO
  if (estado.etapa === 'subproduto') {
    estado.subproduto = texto;
    estado.etapa = 'prazo';
    return {
      resposta: 'Em quantos meses deseja o consórcio?',
      estado
    };
  }

  // PRAZO
  if (estado.etapa === 'prazo') {
    estado.prazo = Number(texto);
    estado.etapa = 'campanha';
    return {
      resposta: 'Qual o destaque principal da campanha?',
      estado
    };
  }

  // CAMPANHA
  if (estado.etapa === 'campanha') {
    estado.campanha.textoPrincipal = texto;
    estado.etapa = 'campanhaAux';
    return {
      resposta: 'Deseja um texto auxiliar? (ou digite "não")',
      estado
    };
  }

  if (estado.etapa === 'campanhaAux') {
    estado.campanha.textoAuxiliar =
      texto === 'não' ? '' : texto;
    estado.etapa = 'tabela';
    return {
      resposta: 'Informe as colunas da tabela separadas por |',
      estado
    };
  }

  // TABELA
  if (estado.etapa === 'tabela') {
    estado.tabela.colunas = mensagem.split('|').map(c => c.trim());
    estado.etapa = 'linhas';
    return {
      resposta: 'Informe as linhas da tabela (uma por linha)',
      estado
    };
  }

  if (estado.etapa === 'linhas') {
    estado.tabela.linhas.push(mensagem);
    if (estado.tabela.linhas.length < 4) {
      return { resposta: 'Próxima linha:', estado };
    }
    estado.etapa = 'extras';
    return { resposta: 'Informe os lances/destaques:', estado };
  }

  // EXTRAS
  if (estado.etapa === 'extras') {
    estado.extras.push(mensagem);
    estado.etapa = 'rodape';
    return { resposta: 'Informe o texto legal do rodapé:', estado };
  }

  // FINAL
  if (estado.etapa === 'rodape') {
    estado.rodape = mensagem;
    estado.prontoParaGerar = true;
    estado.etapa = 'fim';

    return {
      resposta: 'Flyer confirmado. Gerando agora.',
      estado
    };
  }

  return { resposta: 'Não entendi, pode repetir?', estado };
}