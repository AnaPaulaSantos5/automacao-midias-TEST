import { resolverProduto } from './resolverProduto';

/**
 * Estrutura do context (state):
 * {
 *   step: string,
 *   produto: object,
 *   subtipo: string,
 *   meses: number,
 *   campanha: string,
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
       INICIALIZAÇÃO OBRIGATÓRIA
    ========================= */
    context.step ??= 'inicio';
    context.linhas ??= [];
    context.colunas ??= [];
    context.frases ??= {
      modo: null,
      bloco1: null,
      bloco2: null
    };

    /* =========================
       INÍCIO
    ========================= */
    if (context.step === 'inicio') {
      context.step = 'produto';
      return bot(
        'Olá! Qual flyer deseja gerar? Seguro, Finanças ou Benefícios?'
      );
    }

    /* =========================
       RESOLVER PRODUTO
    ========================= */
    if (context.step === 'produto') {
      const produto = resolverProduto(texto);

      if (!produto) {
        return bot(
          'Não entendi. Você pode escolher entre: Seguro, Finanças ou Benefícios.'
        );
      }

      context.produto = produto;

      /* ========= CONSÓRCIO ========= */
      if (produto.key === 'consorcio') {
        context.step = 'consorcio_subtipo';
        return bot(
          'Qual tipo de consórcio? Imóvel, Automóvel ou Pesados?'
        );
      }

      /* ========= SEGUROS ========= */
      if (produto.area === 'confi-seguros') {
        context.step = 'seguro_subtipo';
        return bot(
          'Qual tipo de seguro? Residencial ou Auto?'
        );
      }

      /* ========= BENEFÍCIOS ========= */
      if (produto.area === 'confi-beneficios') {
        context.step = 'beneficios_subtipo';
        return bot(
          'Qual produto deseja criar? Saúde, Odonto ou Pet?'
        );
      }
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
      if (!meses) {
        return bot('Informe apenas o número de meses. Ex: 200');
      }

      context.meses = meses;
      context.step = 'consorcio_campanha';
      return bot(
        'Qual campanha deseja destacar? Ex: parcelas reduzidas, taxa zero, lance embutido…'
      );
    }

    if (context.step === 'consorcio_campanha') {
      context.campanha = input;
      context.step = 'consorcio_colunas';
      return bot(
        'Informe os títulos das colunas da tabela (ou digite "padrão").'
      );
    }

    if (context.step === 'consorcio_colunas') {
      if (texto.includes('padr')) {
        context.colunas = [
          'Crédito',
          'Taxa Adm',
          'Parcela Pessoa Física',
          'Parcela Pessoa Jurídica'
        ];
      } else {
        context.colunas = input.split(',').map(c => c.trim());
      }

      context.step = 'consorcio_linhas';
      return bot(
        'Envie as linhas da tabela uma por mensagem ou digite "continuar".'
      );
    }

    if (context.step === 'consorcio_linhas') {
      if (texto.includes('continuar')) {
        context.step = 'consorcio_texto_complementar';
        return bot(
          'Deseja adicionar um texto complementar? (opcional, digite "Não" se não houver)'
        );
      }

      context.linhas.push(input);
      return bot('Linha adicionada. Envie outra ou digite "continuar".');
    }

    if (context.step === 'consorcio_texto_complementar') {
      context.textoComplementar =
        texto === 'não' ? null : input;

      context.step = 'final';
      return bot(
        `Perfeito! Confira os dados:\n` +
        `Produto: Consórcio\n` +
        `Tipo: ${context.subtipo}\n` +
        `Meses: ${context.meses}\n` +
        `Texto principal: ${context.campanha}\n` +
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
      context.step = 'seguro_frases';
      return bot(
        'Deseja que eu gere a frase ou prefere escrever?'
      );
    }

    if (context.step === 'seguro_frases') {
      if (texto.includes('ger')) {
        context.frases.modo = 'ia';
        context.step = 'seguro_rodape';
        return bot(
          'Deseja incluir as informações de rodapé ou deixar sem?'
        );
      }

      context.frases.modo = 'manual';
      context.step = 'seguro_frase1';
      return bot(
        'Escreva a frase principal (destaque do flyer).'
      );
    }

    if (context.step === 'seguro_frase1') {
      context.frases.bloco1 = input;
      context.step = 'seguro_rodape';
      return bot(
        'Deseja incluir as informações de rodapé ou deixar sem?'
      );
    }

    if (context.step === 'seguro_rodape') {
      context.rodape = !texto.includes('sem');
      context.step = 'final';

      return bot(
        'Perfeito! Prompt pronto para API com base no Seguro selecionado.'
      );
    }

    /* =========================
       BENEFÍCIOS
    ========================= */
    if (context.step === 'beneficios_subtipo') {
      if (
        !texto.includes('odonto') &&
        !texto.includes('pet') &&
        !texto.includes('saúde')
      ) {
        return bot('Escolha entre: Saúde, Odonto ou Pet.');
      }

      context.subtipo = texto.includes('odonto')
        ? 'odonto'
        : texto.includes('pet')
        ? 'pet'
        : 'saude';

      context.step = 'beneficios_frases';
      return bot(
        'Deseja que eu gere as frases automaticamente ou prefere escrever?'
      );
    }

    if (context.step === 'beneficios_frases') {
      if (texto.includes('ger')) {
        context.frases.modo = 'ia';
        context.step = 'final';
        return bot(
          'Perfeito! Prompt do flyer de Benefícios pronto para gerar.'
        );
      }

      context.frases.modo = 'manual';
      context.step = 'beneficios_frase1';
      return bot(
        'Escreva a primeira frase (destaque principal).'
      );
    }

    if (context.step === 'beneficios_frase1') {
      context.frases.bloco1 = input;
      context.step = 'beneficios_frase2';
      return bot('Agora escreva a segunda frase.');
    }

    if (context.step === 'beneficios_frase2') {
      context.frases.bloco2 = input;
      context.step = 'final';
      return bot(
        'Perfeito! Prompt do flyer de Benefícios pronto para gerar.'
      );
    }

    /* =========================
       FINAL
    ========================= */
    if (context.step === 'final') {
      return bot(
        'Caso queira criar outro flyer, é só dizer "novo flyer".'
      );
    }

    return bot('Não entendi. Pode reformular?');

  } catch (error) {
    console.error('Erro no chatEngine:', error);
    context.step = 'inicio';
    return bot('Ocorreu um erro. Vamos recomeçar.');
  }
}