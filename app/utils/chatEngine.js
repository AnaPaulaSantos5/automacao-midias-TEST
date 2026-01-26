import { estadoInicial } from '../data/state';

export function chatEngine(mensagem, estado) {
  const texto = mensagem.toLowerCase().trim();
  const novo = structuredClone(estado);

  switch (estado.etapa) {

    case 'COMEÇAR':
      novo.etapa = 'AREA';
      return { resposta: 'Qual área? Seguros, Finanças ou Benefícios?', estado: novo };

    case 'AREA':
      if (texto.includes('finan')) {
        novo.area = 'confi-financas';
        novo.produto = 'consorcio';
        novo.etapa = 'SUBTIPO';
        return { resposta: 'Consórcio de Imóvel, Automóvel ou Pesados?', estado: novo };
      }
      return { resposta: 'No momento só Finanças.', estado: novo };

    case 'SUBTIPO':
      novo.subproduto = texto;
      novo.etapa = 'MESES';
      return { resposta: 'Em quantos meses?', estado: novo };

    case 'MESES':
      novo.meses = mensagem;
      novo.etapa = 'TITULO';
      return { resposta: 'Destaque principal da campanha?', estado: novo };

    case 'TITULO':
      novo.campanha.textoPrincipal = mensagem;
      novo.etapa = 'AUX';
      return { resposta: 'Texto auxiliar? (ou "não")', estado: novo };

    case 'AUX':
      if (!texto.includes('não')) novo.campanha.textoAuxiliar = mensagem;
      novo.etapa = 'COLUNAS';
      return { resposta: 'Colunas da tabela separadas por |', estado: novo };

    case 'COLUNAS':
      novo.tabela.colunas = mensagem.split('|').map(t => t.trim());
      novo.etapa = 'LINHAS';
      return { resposta: 'Digite uma linha da tabela ou "ok"', estado: novo };

    case 'LINHAS':
      if (texto === 'ok') {
        novo.etapa = 'LANCES';
        return { resposta: 'Digite um lance ou "ok"', estado: novo };
      }
      novo.tabela.linhas.push(mensagem.split('|').map(t => t.trim()));
      return { resposta: 'Linha adicionada. Próxima ou "ok"', estado: novo };

    case 'LANCES':
      if (texto === 'ok') {
        novo.etapa = 'RODAPE';
        return { resposta: 'Texto legal do rodapé:', estado: novo };
      }
      novo.lances.push(mensagem);
      return { resposta: 'Lance adicionado. Outro ou "ok"', estado: novo };

    case 'RODAPE':
      novo.rodape = mensagem;
      novo.layout = 'consorcio-tabela';
      novo.etapa = 'FINAL';
      return { resposta: 'Flyer gerado com sucesso.', estado: novo };

    default:
      return { resposta: 'Reiniciando.', estado: estadoInicial };
  }
}