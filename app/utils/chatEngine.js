import { resolverProduto } from './resolverProduto';
import {
  normalizarCanal,
  normalizarFormato,
  normalizarSubtipoConsorcio
} from './normalizador';

/* =========================
   CHAT ENGINE PRINCIPAL
========================= */
export function chatEngine(message, context = {}) {
  const texto = (message || '').trim();

  // Estado inicial
  if (!context.etapa) {
    context.etapa = 'START';
    return responder(
      'Olá! Sou o Flyer AI da Confi. Me diga qual flyer deseja criar: Consórcio, Seguro ou Benefícios.'
    );
  }

  switch (context.etapa) {
    /* =========================
       START
    ========================= */
    case 'START': {
      const produto = resolverProduto(texto);

      if (!produto) {
        return responder(
          'Não entendi o produto. Pode me dizer, por exemplo: Consórcio, Seguro ou Benefícios.'
        );
      }

      context.produto = produto;
      context.area = produto.area;

      // Fluxos separados
      if (produto.key === 'consorcio') {
        context.etapa = 'CONSORCIO_TIPO';
        return responder('Qual tipo de consórcio? Imóvel, Automóvel ou Pesados?');
      }

      if (produto.key === 'seguro') {
        context.etapa = 'SEGURO_TIPO';
        return responder('Qual seguro deseja criar? Residencial, Auto ou Vida?');
      }

      if (produto.key === 'beneficios') {
        context.etapa = 'BENEFICIO_TIPO';
        return responder('Qual produto deseja criar? Saúde, Odonto ou Pet?');
      }

      return responder('Houve um problema. Vamos tentar novamente.');
    }

    /* =========================
       CONSÓRCIO
    ========================= */
    case 'CONSORCIO_TIPO': {
      const subtipo = normalizarSubtipoConsorcio(texto);
      if (!subtipo) {
        return responder('Tipo inválido. Use: Imóvel, Automóvel ou Pesados.');
      }
      context.subproduto = subtipo;
      context.etapa = 'CONSORCIO_MESES';
      return responder('Quantos meses terá o grupo? (Ex: 200)');
    }

    case 'CONSORCIO_MESES': {
      const meses = parseInt(texto);
      if (isNaN(meses) || meses <= 0) {
        return responder('Número de meses inválido. Digite apenas números, ex: 200');
      }
      context.meses = meses;
      context.etapa = 'CONSORCIO_CAMPANHA';
      return responder(
        'Qual campanha deseja destacar? Ex: parcelas reduzidas, taxa zero, lance embutido…'
      );
    }

    case 'CONSORCIO_CAMPANHA': {
      context.textoPrincipal = texto; // Campanha = texto principal
      context.etapa = 'TABELA_COLUNAS';
      return responder(
        'Agora me informe os títulos das colunas da tabela (ou digite "padrão")'
      );
    }

    case 'TABELA_COLUNAS': {
      context.tabela = { colunas: [], linhas: [] };
      context.tabela.colunas =
        texto.toLowerCase() === 'padrão'
          ? ['Crédito', 'Taxa Adm', 'Parcela PF', 'Parcela PJ']
          : texto.split(',').map(v => v.trim());
      context.etapa = 'TABELA_LINHAS';
      return responder(
        'Envie as linhas da tabela uma por mensagem ou digite "continuar" quando terminar.'
      );
    }

    case 'TABELA_LINHAS': {
      if (texto.toLowerCase() === 'continuar') {
        context.etapa = 'TEXTO_COMPLEMENTAR';
        return responder('Deseja adicionar um texto complementar? (opcional, digite "Não" se não houver)');
      }
      context.tabela.linhas.push(texto);
      return responder('Linha adicionada. Envie outra ou digite "continuar".');
    }

    case 'TEXTO_COMPLEMENTAR': {
      context.textoComplementar =
        texto.toLowerCase() === 'não' || texto.toLowerCase() === 'nao' ? null : texto;
      context.etapa = 'CONFIRMACAO';
      return resumo(context);
    }

    /* =========================
       SEGUROS
    ========================= */
    case 'SEGURO_TIPO': {
      context.subproduto = texto;
      context.etapa = 'SEGURO_TEXTO_PRINCIPAL';
      return responder(
        'Deseja escrever a frase principal ou prefere que eu gere automaticamente? (A = escrever | B = gerar)'
      );
    }

    case 'SEGURO_TEXTO_PRINCIPAL': {
      if (texto.toUpperCase() === 'A') {
        context.etapa = 'SEGURO_TEXTO_INPUT';
        return responder('Digite o texto principal do flyer:');
      }
      context.textoPrincipal = null; // será gerado automaticamente
      context.etapa = 'SEGURO_TEXTO_COMPLEMENTAR';
      return responder('Perfeito. Vou gerar o texto automaticamente.');
    }

    case 'SEGURO_TEXTO_INPUT': {
      context.textoPrincipal = texto;
      context.etapa = 'SEGURO_TEXTO_COMPLEMENTAR';
      return responder('Texto salvo. Deseja adicionar um texto complementar? (opcional)');
    }

    case 'SEGURO_TEXTO_COMPLEMENTAR': {
      context.textoComplementar =
        texto.toLowerCase() === 'não' || texto.toLowerCase() === 'nao' ? null : texto;
      context.etapa = 'CONFIRMACAO';
      return resumo(context);
    }

    /* =========================
       BENEFÍCIOS
    ========================= */
    case 'BENEFICIO_TIPO': {
      context.subproduto = texto;
      context.etapa = 'BENEFICIO_LISTA';
      return responder(
        'Deseja usar a lista padrão de benefícios ou personalizar? (A = padrão | B = personalizar)'
      );
    }

    case 'BENEFICIO_LISTA': {
      context.beneficios = texto.toUpperCase() === 'A' ? 'PADRAO' : 'CUSTOM';
      context.etapa = 'CONFIRMACAO';
      return resumo(context);
    }

    /* =========================
       CONFIRMAÇÃO
    ========================= */
    case 'CONFIRMACAO': {
      if (texto.toLowerCase().includes('sim')) {
        return {
          gerarPrompt: true,
          context
        };
      }
      context.etapa = 'START';
      return responder('Ok. Vamos ajustar. Me diga novamente o produto.');
    }

    default:
      context.etapa = 'START';
      return responder('Houve um problema no fluxo. Vamos recomeçar.');
  }
}

/* =========================
   HELPERS
========================= */
function responder(content) {
  return {
    role: 'assistant',
    content
  };
}

function resumo(context) {
  const baseResumo = [
    `Produto: ${context.produto.nomeExibicao}`,
    context.subproduto ? `Tipo: ${context.subproduto}` : null,
    context.meses ? `Meses: ${context.meses}` : null,
    context.textoPrincipal ? `Texto principal: ${context.textoPrincipal}` : null,
    context.textoComplementar ? `Texto complementar: ${context.textoComplementar}` : 'Não',
    context.beneficios ? `Benefícios: ${context.beneficios}` : null
  ]
    .filter(Boolean)
    .join('\n');

  return responder(
    `Perfeito! Confira os dados:\n${baseResumo}\nPrompt pronto para gerar? (Sim / Ajustar)`
  );
}