import { resolverProduto } from './resolverProduto';
import { initialState } from './data/state';

export function chatEngine(userText, state = initialState) {
  const texto = userText.toLowerCase();

  /* =====================
     INÍCIO
  ===================== */
  if (state.etapa === 'inicio') {
    state.etapa = 'aguardando_produto';
    return {
      resposta: 'Olá! Qual flyer deseja gerar? Seguro, Finanças ou Benefícios?',
      state
    };
  }

  /* =====================
     PRODUTO PRINCIPAL
  ===================== */
  if (state.etapa === 'aguardando_produto') {
    const produto = resolverProduto(texto);

    if (!produto) {
      return {
        resposta: 'Não entendi. Você deseja Seguro, Finanças ou Benefícios?',
        state
      };
    }

    state.produto = produto;

    /* === FINANÇAS === */
    if (produto.key === 'consorcio') {
      state.etapa = 'consorcio_subtipo';
      return {
        resposta: 'Qual tipo de consórcio? Imóvel, Automóvel ou Pesados?',
        state
      };
    }

    /* === SEGUROS === */
    if (produto.area === 'confi-seguros') {
      state.etapa = 'seguro_subtipo';
      return {
        resposta: 'Qual tipo de seguro deseja criar? Residencial ou Auto?',
        state
      };
    }

    /* === BENEFÍCIOS === */
    if (produto.area === 'confi-beneficios') {
      state.etapa = 'beneficios_subtipo';
      return {
        resposta: 'Qual benefício deseja criar? Odonto, Saúde ou Pet?',
        state
      };
    }
  }

  /* =====================
     CONSÓRCIO
  ===================== */
  if (state.etapa === 'consorcio_subtipo') {
    if (!texto.includes('imovel') && !texto.includes('automovel') && !texto.includes('pesados')) {
      return { resposta: 'Escolha: Imóvel, Automóvel ou Pesados.', state };
    }

    state.subtipo = texto.includes('imovel') ? 'imovel' :
                    texto.includes('automovel') ? 'automovel' : 'pesados';

    state.etapa = 'consorcio_meses';
    return { resposta: 'Quantos meses terá o grupo? (Ex: 200)', state };
  }

  if (state.etapa === 'consorcio_meses') {
    const meses = parseInt(texto);
    if (!meses) {
      return { resposta: 'Informe apenas o número de meses.', state };
    }

    state.meses = meses;
    state.etapa = 'consorcio_campanha';
    return {
      resposta: 'Qual campanha deseja destacar? Ex: parcelas reduzidas, taxa zero, lance embutido…',
      state
    };
  }

  if (state.etapa === 'consorcio_campanha') {
    state.campanha = userText;
    state.textoPrincipal = userText; // REGRA CRÍTICA
    state.etapa = 'consorcio_colunas';
    return {
      resposta: 'Informe os títulos das colunas da tabela ou digite "padrão".',
      state
    };
  }

  if (state.etapa === 'consorcio_colunas') {
    state.colunasTabela =
      texto === 'padrão'
        ? ['Crédito', 'Taxa Adm', 'Parcela PF', 'Parcela PJ']
        : userText.split(',').map(c => c.trim());

    state.etapa = 'consorcio_linhas';
    return {
      resposta: 'Envie as linhas da tabela (uma por mensagem) ou digite "continuar".',
      state
    };
  }

  if (state.etapa === 'consorcio_linhas') {
    if (texto === 'continuar') {
      state.etapa = 'consorcio_texto_complementar';
      return {
        resposta: 'Deseja adicionar um texto complementar? (opcional, digite "Não" se não houver)',
        state
      };
    }

    state.linhasTabela.push(userText);
    return { resposta: 'Linha adicionada. Envie outra ou digite "continuar".', state };
  }

  if (state.etapa === 'consorcio_texto_complementar') {
    state.textoComplementar = texto === 'não' ? null : userText;
    state.etapa = 'final';
  }

  /* =====================
     BENEFÍCIOS – ODONTO
  ===================== */
  if (state.etapa === 'beneficios_subtipo') {
    if (texto.includes('odonto')) {
      state.subtipo = 'odonto';
      state.etapa = 'odonto_itens';
      return {
        resposta:
          'Itens padrão:\n1. Consultas\n2. Canal\n3. Extração\n4. Emergências\n5. Restauração\n6. Limpeza\nDeseja usar o padrão ou informar outros?',
        state
      };
    }

    if (texto.includes('saude') || texto.includes('pet')) {
      state.subtipo = texto.includes('saude') ? 'saude' : 'pet';
      state.etapa = 'beneficios_frases';
      return {
        resposta: 'Deseja escrever as frases ou gerar automaticamente? (A = escrever | B = gerar)',
        state
      };
    }

    return { resposta: 'Escolha: Odonto, Saúde ou Pet.', state };
  }

  if (state.etapa === 'odonto_itens') {
    if (texto.includes('padrão')) {
      state.itens = ['Consultas', 'Canal', 'Extração', 'Emergências', 'Restauração', 'Limpeza'];
      state.etapa = 'beneficios_frases';
      return {
        resposta: 'Deseja escrever as frases ou gerar automaticamente? (A = escrever | B = gerar)',
        state
      };
    }

    state.itens = userText.split('\n');
    state.etapa = 'beneficios_frases';
    return {
      resposta: 'Deseja escrever as frases ou gerar automaticamente? (A = escrever | B = gerar)',
      state
    };
  }

  /* =====================
     FRASES BENEFÍCIOS
  ===================== */
  if (state.etapa === 'beneficios_frases') {
    if (texto === 'b') {
      state.textoPrincipal = 'Gerar automaticamente';
      state.textoComplementar = 'Gerar automaticamente';
      state.etapa = 'final';
      return gerarResumo(state);
    }

    if (texto === 'a') {
      state.etapa = 'frase_1';
      return { resposta: 'Escreva a primeira frase (destaque maior):', state };
    }
  }

  if (state.etapa === 'frase_1') {
    state.textoPrincipal = userText;
    state.etapa = 'frase_2';
    return { resposta: 'Agora escreva a segunda frase:', state };
  }

  if (state.etapa === 'frase_2') {
    state.textoComplementar = userText;
    state.etapa = 'final';
  }

  /* =====================
     FINAL
  ===================== */
  if (state.etapa === 'final') {
    return gerarResumo(state);
  }

  return { resposta: 'Algo deu errado. Reiniciando fluxo.', state: initialState };
}

/* =====================
   RESUMO FINAL
===================== */
function gerarResumo(state) {
  return {
    resposta: `Perfeito! Prompt pronto para API.\nProduto: ${state.produto.nomeExibicao}\nSubtipo: ${state.subtipo || '-'}\nTexto principal: ${state.textoPrincipal}\nTexto complementar: ${state.textoComplementar || 'Não informado'}\nDeseja gerar a imagem agora?`,
    state
  };
}