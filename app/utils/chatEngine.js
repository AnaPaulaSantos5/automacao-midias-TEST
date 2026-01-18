import { resolverProduto } from './resolverProduto';

export function chatEngine(message, context = {}) {
  const texto = (message || '').trim();

  // 🔴 Estado inicial
  if (!context.etapa) {
    context.etapa = 'START';
    return responder(
      'Olá! Sou o Flyer AI da Confi. Me diga qual flyer deseja criar: Consórcio, Seguro ou Benefícios.'
    );
  }

  switch (context.etapa) {

    /* =========================
       START - Escolha do produto
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

      // Fluxo Consórcio
      if (produto.key === 'consorcio') {
        context.etapa = 'CONSORCIO_TIPO';
        return responder('Qual tipo de consórcio? Imóvel, Automóvel ou Pesados?');
      }

      // Fluxo Seguro
      if (produto.area === 'confi-seguros') {
        context.etapa = 'SEGURO_TIPO';
        return responder('Qual seguro deseja criar? Residencial, Auto ou Vida?');
      }

      // Fluxo Benefícios
      if (produto.area === 'confi-beneficios') {
        context.etapa = 'BENEFICIO_TIPO';
        return responder('Qual produto deseja criar? Saúde, Odonto ou Pet?');
      }

      return responder('Houve um problema ao identificar o produto. Vamos recomeçar.');
    }

    /* =========================
       CONSÓRCIO
    ========================= */
    case 'CONSORCIO_TIPO': {
      const tipo = texto.toLowerCase();
      if (!context.produto.subtipos[tipo]) {
        return responder('Tipo inválido. Use: Imóvel, Automóvel ou Pesados.');
      }
      context.subproduto = context.produto.subtipos[tipo];
      context.etapa = 'CONSORCIO_MESES';
      return responder('Quantos meses terá o grupo? (Ex: 200)');
    }

    case 'CONSORCIO_MESES': {
      const meses = parseInt(texto);
      if (isNaN(meses) || meses <= 0) {
        return responder('Número de meses inválido. Digite apenas números, ex: 200.');
      }
      context.meses = meses;
      context.etapa = 'CONSORCIO_CAMPANHA';
      return responder('Qual campanha deseja destacar? Ex: parcelas reduzidas, taxa zero, lance embutido…');
    }

    case 'CONSORCIO_CAMPANHA': {
      context.textoPrincipal = texto; // Texto principal = campanha
      context.etapa = 'CONSORCIO_TABELA_COLUNAS';
      return responder('Agora me informe os títulos das colunas da tabela (ou digite "padrão")');
    }

    case 'CONSORCIO_TABELA_COLUNAS': {
      context.tabela = { colunas: [], linhas: [] };
      if (texto.toLowerCase() !== 'padrão') {
        context.tabela.colunas = texto.split(',').map(v => v.trim());
      } else {
        context.tabela.colunas = ['Crédito', 'Taxa Adm', 'Parcela Pessoa Física', 'Parcela Pessoa Jurídica'];
      }
      context.etapa = 'CONSORCIO_TABELA_LINHAS';
      return responder('Envie as linhas da tabela uma por mensagem ou digite "continuar" quando terminar.');
    }

    case 'CONSORCIO_TABELA_LINHAS': {
      if (texto.toLowerCase() === 'continuar') {
        context.etapa = 'CONSORCIO_TEXTO_COMPLEMENTAR';
        return responder('Deseja adicionar um texto complementar? (opcional, digite "Não" se não houver)');
      }
      context.tabela.linhas.push(texto.split(',').map(v => v.trim()));
      return responder('Linha adicionada. Envie outra ou digite "continuar".');
    }

    case 'CONSORCIO_TEXTO_COMPLEMENTAR': {
      context.textoComplementar = texto.toLowerCase() === 'não' ? null : texto;
      context.etapa = 'CONSORCIO_CONFIRMACAO';
      return resumoConsorcio(context);
    }

    case 'CONSORCIO_CONFIRMACAO': {
      if (texto.toLowerCase() === 'sim') {
        return {
          gerarPrompt: true,
          context
        };
      }
      context.etapa = 'START';
      return responder('Ok. Vamos ajustar. Me diga novamente o produto.');
    }

    /* =========================
       SEGUROS
    ========================= */
    case 'SEGURO_TIPO': {
      const tipo = texto.toLowerCase();
      const seguroMap = {
        residencial: 'seguro_residencial',
        auto: 'seguro_auto',
        vida: 'seguro_vida'
      };
      if (!seguroMap[tipo]) {
        return responder('Tipo inválido. Use: Residencial, Auto ou Vida.');
      }
      context.produto = produtos[seguroMap[tipo]];
      context.etapa = 'SEGURO_TEXTO_PRINCIPAL';
      return responder('Deseja escrever a frase principal ou prefere que eu gere automaticamente? (A = escrever | B = gerar)');
    }

    case 'SEGURO_TEXTO_PRINCIPAL': {
      if (texto.toUpperCase() === 'A') {
        context.etapa = 'SEGURO_TEXTO_PRINCIPAL_INPUT';
        return responder('Digite o texto principal do seguro:');
      }
      context.textoPrincipal = null; // Irá gerar automaticamente
      context.etapa = 'SEGURO_TEXTO_COMPLEMENTAR';
      return responder('Perfeito. Vou gerar o texto automaticamente. Deseja adicionar um texto complementar? (opcional)');
    }

    case 'SEGURO_TEXTO_PRINCIPAL_INPUT': {
      context.textoPrincipal = texto;
      context.etapa = 'SEGURO_TEXTO_COMPLEMENTAR';
      return responder('Texto salvo. Deseja adicionar um texto complementar? (opcional, digite "Não" se não houver)');
    }

    case 'SEGURO_TEXTO_COMPLEMENTAR': {
      context.textoComplementar = texto.toLowerCase() === 'não' ? null : texto;
      context.etapa = 'SEGURO_CONFIRMACAO';
      return resumoSeguro(context);
    }

    case 'SEGURO_CONFIRMACAO': {
      if (texto.toLowerCase() === 'sim') {
        return {
          gerarPrompt: true,
          context
        };
      }
      context.etapa = 'START';
      return responder('Ok. Vamos ajustar. Me diga novamente o produto.');
    }

    /* =========================
       BENEFÍCIOS
    ========================= */
    case 'BENEFICIO_TIPO': {
      const tipo = texto.toLowerCase();
      const beneficioMap = {
        saude: 'plano_saude',
        odonto: 'seguro_odonto',
        pet: 'seguro_pet'
      };
      if (!beneficioMap[tipo]) {
        return responder('Produto inválido. Use: Saúde, Odonto ou Pet.');
      }
      context.produto = produtos[beneficioMap[tipo]];
      context.etapa = 'BENEFICIO_LISTA';
      return responder('Deseja usar a lista padrão de benefícios ou personalizar? (A = padrão | B = personalizar)');
    }

    case 'BENEFICIO_LISTA': {
      if (texto.toUpperCase() === 'A') {
        context.listaPadrao = true;
      } else {
        context.listaPadrao = false;
      }
      context.etapa = 'BENEFICIO_CONFIRMACAO';
      return resumoBeneficio(context);
    }

    case 'BENEFICIO_CONFIRMACAO': {
      if (texto.toLowerCase() === 'sim') {
        return {
          gerarPrompt: true,
          context
        };
      }
      context.etapa = 'START';
      return responder('Ok. Vamos ajustar. Me diga novamente o produto.');
    }

    /* =========================
       DEFAULT
    ========================= */
    default:
      context.etapa = 'START';
      return responder(
        'Houve um problema no fluxo. Vamos recomeçar. Qual flyer deseja criar?'
      );
  }
}

/* =========================
   HELPERS
========================= */

function responder(content) {
  return { role: 'assistant', content };
}

function resumoConsorcio(context) {
  return responder(`Perfeito! Confira os dados:

Produto: ${context.produto.nomeExibicao}
Tipo: ${context.subproduto.nomeExibicao}
Meses: ${context.meses}
Texto principal: ${context.textoPrincipal}
Texto complementar: ${context.textoComplementar || 'Não'}

Prompt pronto para gerar? (Sim / Ajustar)`);
}

function resumoSeguro(context) {
  return responder(`Perfeito! Confira os dados:

Produto: ${context.produto.nomeExibicao}
Texto principal: ${context.textoPrincipal || 'Será gerado automaticamente'}
Texto complementar: ${context.textoComplementar || 'Não'}

Prompt pronto para gerar? (Sim / Ajustar)`);
}

function resumoBeneficio(context) {
  return responder(`Perfeito! Confira os dados:

Produto: ${context.produto.nomeExibicao}
Lista padrão: ${context.listaPadrao ? 'Sim' : 'Personalizada'}

Prompt pronto para gerar? (Sim / Ajustar)`);
}