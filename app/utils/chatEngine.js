// app/utils/chatEngine.js

export function chatEngine(input, state) {
  const texto = input.trim().toLowerCase();

  switch (state.etapa) {
    case 'START':
      state.etapa = 'AREA';
      return 'Olá! Qual área deseja? Seguros, Finanças ou Benefícios?';

    case 'AREA':
      if (texto.includes('seguro')) {
        state.area = 'confi-seguros';
        state.etapa = 'PRODUTO_SEGUROS';
        return 'Perfeito. Qual tipo de seguro? Geral ou Residencial?';
      }

      if (texto.includes('finan')) {
        state.area = 'confi-financas';
        state.produto = 'consorcio';
        state.etapa = 'SUBPRODUTO_CONSORCIO';
        return 'Ótimo. Qual tipo de consórcio? Imóvel, Automóvel ou Pesados?';
      }

      if (texto.includes('benef')) {
        state.area = 'confi-beneficios';
        state.etapa = 'PRODUTO_BENEFICIOS';
        return 'Certo. Qual produto? Odonto, Saúde ou Pet?';
      }

      return 'Não entendi. Escolha entre Seguros, Finanças ou Benefícios.';

    case 'PRODUTO_SEGUROS':
      state.produto = 'seguro';
      state.subproduto = texto.includes('resid') ? 'residencial' : 'geral';
      state.etapa = 'FINAL';
      return 'Perfeito. Vou preparar o flyer conforme o padrão da Confi Seguros.';

    case 'SUBPRODUTO_CONSORCIO':
      if (!['imovel', 'automovel', 'pesados'].some(p => texto.includes(p))) {
        return 'Escolha entre Imóvel, Automóvel ou Pesados.';
      }

      state.subproduto = texto.includes('imovel')
        ? 'imovel'
        : texto.includes('automovel')
        ? 'automovel'
        : 'pesados';

      state.etapa = 'MESES_CONSORCIO';
      return 'Quantos meses terá o grupo? Exemplo: 200';

    case 'MESES_CONSORCIO':
      const meses = parseInt(texto.replace(/\D/g, ''));
      if (!meses) return 'Informe apenas o número de meses.';

      state.meses = meses;
      state.etapa = 'CAMPANHA';
      return 'Qual campanha deseja destacar?';

    case 'CAMPANHA':
      state.campanha = {
        textoPrincipal: input,
        textoAuxiliar: 'Menores até a contemplação'
      };
      state.etapa = 'TABELA_CONFIRM';
      return 'Deseja inserir uma tabela? (sim ou não)';

    case 'TABELA_CONFIRM':
      if (texto.includes('sim')) {
        state.etapa = 'TABELA_COLUNAS';
        return 'Informe os títulos das colunas separados por vírgula.';
      }
      state.etapa = 'FINAL';
      return 'Certo. Flyer será gerado sem tabela.';

    case 'TABELA_COLUNAS':
      state.tabela.colunas = input.split(',').map(c => c.trim());
      state.etapa = 'TABELA_LINHAS';
      return 'Envie as linhas da tabela. Digite "fim" para concluir.';

    case 'TABELA_LINHAS':
      if (texto === 'fim') {
        state.etapa = 'FINAL';
        return 'Tabela registrada. Pronto para gerar.';
      }
      state.tabela.linhas.push(input);
      return 'Linha adicionada. Envie outra ou digite "fim".';

    case 'PRODUTO_BENEFICIOS':
      state.produto = 'beneficios';
      state.subproduto = texto.includes('odonto')
        ? 'odonto'
        : texto.includes('saude')
        ? 'saude'
        : 'pet';
      state.etapa = 'FINAL';
      return 'Perfeito. Vou gerar o flyer conforme o padrão da Confi Benefícios.';

    case 'FINAL':
      return 'Tudo pronto. Posso gerar o flyer agora.';

    default:
      state.etapa = 'START';
      return 'Vamos começar novamente. Qual área deseja?';
  }
}