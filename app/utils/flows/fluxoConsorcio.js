/**
 * fluxoConsorcio.js
 * Fluxo do chat para criação de flyers de Consórcio (Finanças)
 * Inclui:
 * - Tipo de consórcio (Imóvel, Automóvel, Pesados)
 * - Meses do grupo
 * - Campanha
 * - Tabela (colunas e linhas)
 * - Texto principal e complementar
 */

export function fluxoConsorcio(context, message) {
  const texto = (message || '').trim();

  switch (context.etapa) {
    case 'START_CONSORCIO':
      context.etapa = 'TIPO_SUBPRODUTO';
      return {
        role: 'assistant',
        content: 'Qual tipo de consórcio? Imóvel, Automóvel ou Pesados?'
      };

    case 'TIPO_SUBPRODUTO':
      context.subproduto = texto.toLowerCase();
      context.etapa = 'MESES';
      return {
        role: 'assistant',
        content: 'Quantos meses terá o grupo? (Ex: 200)'
      };

    case 'MESES':
      context.meses = texto;
      context.etapa = 'CAMPANHA';
      return {
        role: 'assistant',
        content:
          'Qual campanha deseja destacar? Ex: parcelas reduzidas, taxa zero, lance embutido…'
      };

    case 'CAMPANHA':
      context.campanha = texto;
      context.etapa = 'TABELA_COLUNAS';
      return {
        role: 'assistant',
        content:
          'Agora me informe os títulos das colunas da tabela (separe por vírgula) ou digite "padrão".'
      };

    case 'TABELA_COLUNAS':
      if (texto.toLowerCase() === 'padrão') {
        context.tabela = {
          colunas: ['Crédito', 'Taxa Adm', 'PF', 'PJ'],
          linhas: [
            ['R$ 150.000', '21%', 'R$ 623', 'R$ 553'],
            ['R$ 300.000', '19%', 'R$ 1.226', 'R$ 1.089'],
            ['R$ 600.000', '17,5%', 'R$ 2.423', 'R$ 2.151'],
            ['R$ 1.000.000', '17,5%', 'R$ 4.039', 'R$ 3.585']
          ]
        };
        context.etapa = 'TEXTO_PRINCIPAL_ESCOLHA';
        return {
          role: 'assistant',
          content:
            'Tabela padrão aplicada. Deseja escrever o texto principal da campanha ou prefere que eu gere? (A = escrever | B = gerar)'
        };
      }

      context.tabela = { colunas: texto.split(',').map(v => v.trim()), linhas: [] };
      context.etapa = 'TABELA_LINHAS';
      return {
        role: 'assistant',
        content:
          'Envie as linhas da tabela uma por mensagem ou digite "continuar" quando terminar.'
      };

    case 'TABELA_LINHAS':
      if (texto.toLowerCase() === 'continuar') {
        context.etapa = 'TEXTO_PRINCIPAL_ESCOLHA';
        return {
          role: 'assistant',
          content: 'Deseja escrever o texto principal da campanha ou prefere que eu gere? (A = escrever | B = gerar)'
        };
      }
      context.tabela.linhas.push(texto.split(',').map(v => v.trim()));
      return {
        role: 'assistant',
        content: 'Linha adicionada. Envie outra ou digite "continuar".'
      };

    case 'TEXTO_PRINCIPAL_ESCOLHA':
      if (texto.toUpperCase() === 'A') {
        context.etapa = 'TEXTO_PRINCIPAL_INPUT';
        return { role: 'assistant', content: 'Digite o texto principal da campanha:' };
      }
      context.textoPrincipal = null; // será gerado
      context.etapa = 'TEXTO_COMPLEMENTAR';
      return { role: 'assistant', content: 'Perfeito. Vou gerar o texto automaticamente.' };

    case 'TEXTO_PRINCIPAL_INPUT':
      context.textoPrincipal = texto;
      context.etapa = 'TEXTO_COMPLEMENTAR';
      return { role: 'assistant', content: 'Texto salvo. Deseja adicionar um texto complementar? (opcional)' };

    case 'TEXTO_COMPLEMENTAR':
      context.textoComplementar = texto || null;
      context.etapa = 'CONFIRMACAO';
      return {
        role: 'assistant',
        content: `Perfeito! Confira os dados:
Produto: Consórcio
Tipo: ${context.subproduto}
Meses: ${context.meses}
Campanha: ${context.campanha}
Prompt pronto para gerar? (Sim / Ajustar)`
      };

    case 'CONFIRMACAO':
      if (texto.toLowerCase() === 'sim') {
        return { gerarPrompt: true, context };
      }
      context.etapa = 'START_CONSORCIO';
      return { role: 'assistant', content: 'Ok, vamos ajustar. Qual tipo de consórcio deseja?' };

    default:
      context.etapa = 'START_CONSORCIO';
      return { role: 'assistant', content: 'Erro no fluxo. Vamos recomeçar. Qual flyer deseja criar?' };
  }
}