import { chatEngine } from '../chatEngine';
import { imageEngine } from '../../utils/imageEngine';
import { initialState } from '../../data/state';
import { normalizarConsorcioTabelaState } from '../../../lib/flyerSchemas/consorcioTabela.schema';

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message;
    const state =
      body.state && body.state.etapa
        ? body.state
        : initialState;

    // 🔹 executa o chat
    const chatResult = chatEngine(message, state);
    let novoState = chatResult.state;

    // 🔹 Se ainda não é FINAL, retorna apenas a resposta
    if (novoState.etapa !== 'FINAL') {
      return Response.json(chatResult);
    }

    // 🔹 Normaliza os dados do flyer (somente para consórcio com tabela)
    if (novoState.area === 'confi-financas' && novoState.subproduto) {
      novoState = {
        ...novoState,
        ...normalizarConsorcioTabelaState(novoState),
        flyerTipo: 'CONSORCIO_TABELA'
      };
    }

    // 🔹 Geração de imagem
    const imageResult = await imageEngine(novoState);

    if (!imageResult.ok) {
      return Response.json({
        resposta: imageResult.error,
        state: novoState
      });
    }

    return Response.json({
      resposta: 'Flyer gerado com sucesso.',
      imageBase64: imageResult.imageBase64,
      state: novoState
    });

  } catch (error) {
    console.error('🔥 ERRO REAL:', error);

    return Response.json({
      resposta: 'Erro inesperado.',
      state: initialState
    });
  }
}