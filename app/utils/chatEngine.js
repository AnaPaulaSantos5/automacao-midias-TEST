import { resolverProduto } from './resolverProduto';
import {
  normalizarFormato,
  normalizarCanal,
  normalizarSubtipoConsorcio
} from './normalizador';

export function chatEngine(mensagem, context) {
  const texto = mensagem.trim();
  const resposta = (msg) => ({
    resposta: msg,
    context
  });

  // Estado inicial
  if (!context.etapa) {
    context.etapa = 'INICIO';
  }

  switch (context.etapa) {
    // =============================
    // INÍCIO
    // =============================
    case 'INICIO': {
      context.etapa = 'IDENTIFICAR_PRODUTO';
      return resposta(
        'Qual produto você deseja divulgar? (ex: Seguro Residencial, Consórcio Imóvel, Seguro Odonto)'
      );
    }

    // =============================
    // IDENTIFICA PRODUTO
    // =============================
    case 'IDENTIFICAR_PRODUTO': {
      const produto = resolverProduto(texto);

      if (!produto) {
        return resposta(
          'Não consegui identificar o produto. Pode tentar novamente?'
        );
      }

      context.area = produto.area;
      context.produto = produto.produto;
      context.subproduto = produto.subproduto || null;

      // Consórcio exige subtipo
      if (produto.produto === 'consorcio' && !context.subproduto) {
        context.etapa = 'CONSORCIO_TIPO';
        return resposta(
          'Qual tipo de consórcio? (Imóvel, Automóvel ou Pesados)'
        );
      }

      context.etapa = 'ESCOLHER_FORMATO';
      return resposta(
        'Qual formato do flyer? (1:1, 4:5 ou 9:16)'
      );
    }

    // =============================
    // SUBTIPO CONSÓRCIO
    // =============================
    case 'CONSORCIO_TIPO': {
      const subtipo = normalizarSubtipoConsorcio(texto);

      if (!subtipo) {
        return resposta(
          'Tipo inválido. Escolha entre Imóvel, Automóvel ou Pesados.'
        );
      }

      context.subproduto = subtipo;
      context.etapa = 'ESCOLHER_FORMATO';

      return resposta(
        'Qual formato do flyer? (1:1, 4:5 ou 9:16)'
      );
    }

    // =============================
    // FORMATO
    // =============================
    case 'ESCOLHER_FORMATO': {
      const formato = normalizarFormato(texto);

      if (!formato) {
        return resposta(
          'Formato inválido. Use 1:1, 4:5 ou 9:16.'
        );
      }

      context.formato = formato;
      context.etapa = 'ESCOLHER_CANAL';

      return resposta(
        'Onde será postado? (Instagram ou WhatsApp)'
      );
    }

    // =============================
    // CANAL
    // =============================
    case 'ESCOLHER_CANAL': {
      const canal = normalizarCanal(texto);

      if (!canal) {
        return resposta(
          'Canal inválido. Escolha Instagram ou WhatsApp.'
        );
      }

      context.canal = canal;

      // Consórcio NÃO tem campanha
      if (context.produto === 'consorcio') {
        context.etapa = 'TEXTO_PRINCIPAL_ESCOLHA';
        return resposta(
          'Deseja escrever o texto principal da campanha ou prefere que eu gere? (A/B)'
        );
      }

      // Seguros e Benefícios podem ter campanha
      context.etapa = 'CAMPANHA_OPCIONAL';
      return resposta(
        'Deseja informar uma campanha específica? (ex: Janeiro Azul) ou digite NÃO'
      );
    }

    // =============================
    // CAMPANHA
    // =============================
    case 'CAMPANHA_OPCIONAL': {
      if (texto.toLowerCase() !== 'não' && texto.toLowerCase() !== 'nao') {
        context.campanha = texto;
      } else {
        context.campanha = null;
      }

      context.etapa = 'TEXTO_PRINCIPAL_ESCOLHA';

      return resposta(
        'Deseja escrever o texto principal ou prefere que eu gere automaticamente? (A/B)'
      );
    }

    // =============================
    // TEXTO PRINCIPAL - ESCOLHA
    // =============================
    case 'TEXTO_PRINCIPAL_ESCOLHA': {
      if (texto.toUpperCase() === 'A') {
        context.etapa = 'TEXTO_PRINCIPAL_MANUAL';
        return resposta('Digite o texto principal do flyer.');
      }

      if (texto.toUpperCase() === 'B') {
        context.textoPrincipal = null;
        context.etapa = 'CONFIRMACAO_FINAL';
        return resposta(
          'Perfeito. Vou gerar o texto automaticamente. Deseja confirmar a criação do flyer? (SIM/NÃO)'
        );
      }

      return resposta(
        'Opção inválida. Digite A para escrever ou B para gerar automaticamente.'
      );
    }

    // =============================
    // TEXTO PRINCIPAL MANUAL
    // =============================
    case 'TEXTO_PRINCIPAL_MANUAL': {
      context.textoPrincipal = texto;
      context.etapa = 'CONFIRMACAO_FINAL';

      return resposta(
        'Texto registrado. Deseja confirmar a criação do flyer? (SIM/NÃO)'
      );
    }

    // =============================
    // CONFIRMAÇÃO FINAL
    // =============================
    case 'CONFIRMACAO_FINAL': {
      if (texto.toUpperCase() === 'SIM') {
        context.etapa = 'GERAR_FLYER';

        return {
          resposta: 'Gerando o flyer com base nas informações fornecidas...',
          context,
          gerarFlyer: true
        };
      }

      if (texto.toUpperCase() === 'NÃO' || texto.toUpperCase() === 'NAO') {
        context.etapa = 'INICIO';
        return resposta(
          'Tudo bem. Podemos começar novamente quando quiser.'
        );
      }

      return resposta(
        'Resposta inválida. Digite SIM ou NÃO.'
      );
    }

    // =============================
    // FALLBACK
    // =============================
    default:
      context.etapa = 'INICIO';
      return resposta(
        'Algo saiu do fluxo. Vamos começar novamente.'
      );
  }
}