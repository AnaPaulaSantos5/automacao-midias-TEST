import { estadoInicial } from '../data/state';

export function chatEngine(mensagem, estado = estadoInicial) {
  const texto = mensagem.toLowerCase().trim();
  const novo = structuredClone(estado);

  switch (estado.etapa) {

    case 'COMECO':
      novo.etapa = 'AREA';
      return {
        resposta: 'Qual área deseja? Seguros, Finanças ou Benefícios?',
        estado: novo
      };

    case 'AREA':
      if (texto.includes('fin')) {
        novo.area = 'financas';
        novo.etapa = 'PRODUTO';
        return { resposta: 'Qual produto? Consórcio?', estado: novo };
      }
      return { resposta: 'Informe: Seguros, Finanças ou Benefícios.', estado };

    case 'PRODUTO':
      novo.produto = 'consorcio';
      novo.etapa = 'SUBTIPO';
      return {
        resposta: 'Qual o tipo? Imóvel, Automóvel ou Pesados?',
        estado: novo
      };

    case 'SUBTIPO':
      novo.subproduto = texto;
      novo.etapa = 'MESES';
      return { resposta: 'Em quantos meses?', estado: novo };

    case 'MESES':
      novo.meses = mensagem;
      novo.etapa = 'TITULO';
      return { resposta: 'Qual o destaque da campanha?', estado: novo };

    case 'TITULO':
      novo.campanha.textoPrincipal = mensagem;
      novo.etapa = 'AUX';
      return {
        resposta: 'Deseja texto auxiliar? (ou "não")',
        estado: novo
      };

    case 'AUX':
      if (!texto.includes('não')) {
        novo.campanha.textoAuxiliar = mensagem;
      }
      novo.etapa = 'COLUNAS';
      return {
        resposta: 'Informe as colunas da tabela separadas por |',
        estado: novo
      };

    case 'COLUNAS':
      novo.tabela.colunas = mensagem.split('|').map(c => c.trim());
      novo.etapa = 'LINHAS';
      return {
        resposta: 'Informe uma linha da tabela (ou "ok")',
        estado: novo
      };

    case 'LINHAS':
      if (texto === 'ok') {
        novo.etapa = 'LANCES';
        return { resposta: 'Informe um lance/destaque:', estado: novo };
      }
      novo.tabela.linhas.push(mensagem.split('|').map(c => c.trim()));
      return { resposta: 'Próxima linha ou "ok"', estado: novo };

    case 'LANCES':
      novo.lances.push(mensagem);
      novo.etapa = 'RODAPE';
      return {
        resposta: 'Informe o texto legal do rodapé.',
        estado: novo
      };

    case 'RODAPE':
      novo.rodape = mensagem;
      novo.etapa = 'FINAL';
      return {
        resposta: 'Flyer gerado com sucesso.',
        estado: novo
      };

    default:
      return {
        resposta: 'Vamos começar novamente.',
        estado: estadoInicial
      };
  }
}