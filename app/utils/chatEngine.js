import { resolverProduto } from './resolverProduto';

export function chatEngine(input, context) {
  try {
    const texto = input.toLowerCase();

    // =========================
    // INICIALIZAÇÃO
    // =========================
    if (!context.step) {
      context.step = 'inicio';
    }

    // =========================
    // INÍCIO
    // =========================
    if (context.step === 'inicio') {
      context.step = 'categoria';
      return bot('Olá! Qual flyer deseja gerar? Seguro, Finanças ou Benefícios?');
    }

    // =========================
    // CATEGORIA
    // =========================
    if (context.step === 'categoria') {
      const resultado = resolverProduto(texto);

      if (!resultado || !resultado.categoria) {
        return bot('Por favor, escolha uma opção válida: Seguro, Finanças ou Benefícios.');
      }

      context.categoria = resultado.categoria;

      if (resultado.categoria === 'seguro') {
        context.step = 'tipo_seguro';
        return bot('Qual tipo de seguro? Residencial ou Auto?');
      }

      if (resultado.categoria === 'beneficios') {
        context.step = 'tipo_beneficio';
        return bot('Seguro Odonto, Saúde ou Pet?');
      }

      if (resultado.categoria === 'financas') {
        context.produto = 'consorcio';
        context.step = 'frase';
        return bot('Deseja que eu gere a frase da campanha ou prefere escrever?');
      }
    }

    // =========================
    // TIPO DE SEGURO
    // =========================
    if (context.step === 'tipo_seguro') {
      const produto = resolverProduto(texto);

      if (!produto) {
        return bot('Informe corretamente: Seguro Residencial ou Seguro Auto.');
      }

      context.produto = produto;
      context.step = 'frase';
      return bot('Deseja que eu gere a frase ou prefere escrever?');
    }

    // =========================
    // TIPO DE BENEFÍCIO
    // =========================
    if (context.step === 'tipo_beneficio') {
      const produto = resolverProduto(texto);

      if (!produto) {
        return bot('Informe corretamente: Odonto, Saúde ou Pet.');
      }

      context.produto = produto;

      // Odonto tem fluxo especial
      if (produto.id === 'seguro_odonto') {
        context.step = 'formato';
        return bot('Esse flyer é para qual formato? (9:16, 1:1, etc)');
      }

      // Saúde e Pet → só frase
      context.step = 'frase';
      return bot('Deseja que eu gere as frases automaticamente ou prefere escrever?');
    }

    // =========================
    // FORMATO (ODONTO)
    // =========================
    if (context.step === 'formato') {
      context.formato = texto;
      context.step = 'itens_odonto';

      return bot(
        `Ok. Os itens padrão são:
1. Consultas
2. Tratamento de Canal
3. Extração do siso
4. Emergências
5. Restauração
6. Limpeza

Deseja usar o padrão ou informar outros itens?`
      );
    }

    // =========================
    // ITENS ODONTO
    // =========================
    if (context.step === 'itens_odonto') {
      if (texto.includes('padr')) {
        context.itens = 'padrao';
        context.step = 'frases_odonto';
        return bot('Posso gerar as frases automaticamente ou prefere escrever?');
      }

      context.itens = 'custom';
      context.step = 'itens_custom';
      return bot('Ok, escreva os itens em tópicos.');
    }

    if (context.step === 'itens_custom') {
      context.itens_lista = input.split('\n');
      context.step = 'frases_odonto';
      return bot('Deseja que eu gere as frases automaticamente ou prefere escrever?');
    }

    // =========================
    // FRASES
    // =========================
    if (context.step === 'frases_odonto' || context.step === 'frase') {
      if (texto.includes('gerar')) {
        context.frases.modo = 'ia';
        context.step = 'rodape';
        return bot('Deseja incluir as informações de rodapé ou deixar sem?');
      }

      context.frases.modo = 'manual';
      context.step = 'frase1';
      return bot('Escreva a primeira frase (destaque principal).');
    }

    if (context.step === 'frase1') {
      context.frases.bloco1 = input;
      context.step = 'frase2';
      return bot('Agora escreva a segunda frase.');
    }

    if (context.step === 'frase2') {
      context.frases.bloco2 = input;
      context.step = 'rodape';
      return bot('Deseja incluir as informações de rodapé ou deixar sem?');
    }

    // =========================
    // RODAPÉ
    // =========================
    if (context.step === 'rodape') {
      context.rodape = texto.includes('sim') || texto.includes('desejo');
      context.step = 'final';
      return gerarPromptFinal(context);
    }

    return bot('Não entendi. Pode reformular?');
  } catch (e) {
    console.error(e);
    context.step = 'inicio';
    return bot('Ocorreu um erro. Vamos recomeçar.');
  }
}

// =========================
// HELPERS
// =========================
function bot(text) {
  return { role: 'assistant', content: text };
}

function gerarPromptFinal(context) {
  context.pronto = true;

  return {
    role: 'assistant',
    content: `Segue o prompt do flyer baseado no modelo da Confi (${context.produto.nome}). Pronto para gerar a arte.`
  };
}