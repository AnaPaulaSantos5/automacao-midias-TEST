import { resolverProduto } from './resolverProduto';

/**
 * Estrutura do context (state):
 * {
 *   step: string,
 *   categoria: 'seguro' | 'financas' | 'beneficios' | null,
 *   produto: object | null,
 *   subtipo: string | null,
 *   meses: number | null,
 *   campanha: string | null,
 *   colunas: array,
 *   linhas: array,
 *   frases: {
 *     modo: 'ia' | 'manual' | null,
 *     bloco1: string | null,
 *     bloco2: string | null
 *   },
 *   rodape: boolean | null
 * }
 */

function bot(content) {
  return { role: 'assistant', content };
}

export function chatEngine(input, context) {
  try {
    const texto = (input || '').toLowerCase();

    /* =========================
       INICIALIZAÇÃO
    ========================= */
    context.step ??= 'inicio';
    context.categoria ??= null;
    context.produto ??= null;
    context.subtipo ??= null;
    context.meses ??= null;
    context.campanha ??= null;
    context.colunas ??= [];
    context.linhas ??= [];
    context.frases ??= { modo: null, bloco1: null, bloco2: null };
    context.rodape ??= null;

    /* =========================
       INÍCIO
    ========================= */
    if (context.step === 'inicio') {
      context.step = 'categoria';
      return bot('Olá! Qual flyer deseja gerar? Seguro, Finanças ou Benefícios?');
    }

    /* =========================
       CATEGORIA
    ========================= */
    if (context.step === 'categoria') {
      if (texto.includes('segur')) {
        context.categoria = 'seguro';
        context.step = 'seguro_subtipo';
        return bot('Qual tipo de seguro? Residencial ou Auto?');
      }

      if (texto.includes('benef')) {
        context.categoria = 'beneficios';
        context.step = 'beneficios_subtipo';
        return bot('Qual produto deseja criar? Saúde, Odonto ou Pet?');
      }

      if (texto.includes('finan') || texto.includes('consor')) {
        context.categoria = 'financas';
        context.produto = resolverProduto('consorcio');
        context.step = 'consorcio_subtipo';
        return bot('Qual tipo de consórcio? Imóvel, Automóvel ou Pesados?');
      }

      return bot('Escolha uma opção válida: Seguro, Finanças ou Benefícios.');
    }

    /* =========================
       CONSÓRCIO
    ========================= */
    if (context.step === 'consorcio_subtipo') {
      if (!texto.includes('im') && !texto.includes('auto') && !texto.includes('pes')) {
        return bot('Escolha entre: Imóvel, Automóvel ou Pesados.');
      }

      context.subtipo = texto.includes('im')
        ? 'imovel'
        : texto.includes('auto')
        ? 'automovel'
        : 'pesados';

      context.step = 'consorcio_meses';
      return bot('Quantos meses terá o grupo? (Ex: 200)');
    }

    if (context.step === 'consorcio_meses') {
      const meses = parseInt(texto.replace(/\D/g, ''));
      if (!meses) return bot('Informe apenas o número de meses. Ex: 200');

      context.meses = meses;
      context.step = 'consorcio_campanha';
      return bot('Qual campanha deseja destacar?');
    }

    if (context.step === 'consorcio_campanha') {
      context.campanha = input;
      context.step = 'consorcio_colunas';
      return bot('Informe os títulos das colunas da tabela ou digite "padrão".');
    }

    if (context.step === 'consorcio_colunas') {
      context.colunas = texto.includes('padr')
        ? ['Crédito', 'Taxa Adm', 'Parcela Pessoa Física', 'Parcela Pessoa Jurídica']
        : input.split(',').map(c => c.trim());

      context.step = 'consorcio_linhas';
      return bot('Envie as linhas da tabela ou digite "continuar".');
    }

    if (context.step === 'consorcio_linhas') {
      if (texto.includes('continuar')) {
        context.step = 'consorcio_texto_complementar';
        return bot('Deseja adicionar um texto complementar? (digite "Não" se não)');
      }

      context.linhas.push(input);
      return bot('Linha adicionada. Envie outra ou "continuar".');
    }

    if (context.step === 'consorcio_texto_complementar') {
      context.textoComplementar = texto.includes('não') ? null : input;
      context.step = 'final';

      return bot(
        `Perfeito! Confira os dados:\n` +
        `Produto: Consórcio\n` +
        `Tipo: ${context.subtipo}\n` +
        `Meses: ${context.meses}\n` +
        `Texto principal: ${context.campanha}\n\n` +
        `Prompt pronto para gerar? (Sim / Ajustar)`
      );
    }

    /* =========================
       SEGUROS
    ========================= */
    if (context.step === 'seguro_subtipo') {
      if (!texto.includes('res') && !texto.includes('auto')) {
        return bot('Escolha: Residencial ou Auto.');
      }

      context.subtipo = texto.includes('res') ? 'residencial' : 'auto';
      context.produto = resolverProduto(`seguro ${context.subtipo}`);
      context.step = 'seguro_frases';
      return bot('Deseja que eu gere a frase ou prefere escrever?');
    }

    if (context.step === 'seguro_frases') {
      if (texto.includes('ger')) {
        context.frases.modo = 'ia';
        context.step = 'seguro_rodape';
        return bot('Deseja incluir as informações de rodapé ou deixar sem?');
      }

      context.frases.modo = 'manual';
      context.step = 'seguro_frase1';
      return bot('Escreva a frase principal.');
    }

    if (context.step === 'seguro_frase1') {
      context.frases.bloco1 = input;
      context.step = 'seguro_rodape';
      return bot('Deseja incluir as informações de rodapé ou deixar sem?');
    }

    if (context.step === 'seguro_rodape') {
      context.rodape = !texto.includes('sem');
      context.step = 'final';
      return bot('Perfeito! Prompt pronto para API com base no Seguro selecionado.');
    }

    /* =========================
       BENEFÍCIOS
    ========================= */
    if (context.step === 'beneficios_subtipo') {
      if (!texto.includes('odonto') && !texto.includes('pet') && !texto.includes('saú')) {
        return bot('Escolha entre: Saúde, Odonto ou Pet.');
      }

      context.subtipo = texto.includes('odonto')
        ? 'odonto'
        : texto.includes('pet')
        ? 'pet'
        : 'saude';

      context.produto = resolverProduto(context.subtipo);
      context.step = 'beneficios_frases';
      return bot('Deseja que eu gere as frases automaticamente ou prefere escrever?');
    }

    if (context.step === 'beneficios_frases') {
      if (texto.includes('ger')) {
        context.frases.modo = 'ia';
        context.step = 'final';
        return bot('Perfeito! Prompt do flyer de Benefícios pronto para gerar.');
      }

      context.frases.modo = 'manual';
      context.step = 'beneficios_frase1';
      return bot('Escreva a primeira frase.');
    }

    if (context.step === 'beneficios_frase1') {
      context.frases.bloco1 = input;
      context.step = 'beneficios_frase2';
      return bot('Agora escreva a segunda frase.');
    }

    if (context.step === 'beneficios_frase2') {
      context.frases.bloco2 = input;
      context.step = 'final';
      return bot('Perfeito! Prompt do flyer de Benefícios pronto para gerar.');
    }

    /* =========================
       FINAL
    ========================= */
    if (context.step === 'final') {
      if (texto.includes('novo')) {
        Object.keys(context).forEach(k => delete context[k]);
        context.step = 'inicio';
        return bot('Vamos lá! Qual flyer deseja gerar?');
      }

      return bot('Caso queira criar outro flyer, diga "novo flyer".');
    }

    return bot('Não entendi. Pode reformular?');

  } catch (error) {
    console.error('Erro no chatEngine:', error);
    Object.keys(context).forEach(k => delete context[k]);
    context.step = 'inicio';
    return bot('Ocorreu um erro. Vamos recomeçar.');
  }
}