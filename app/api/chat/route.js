import { chatEngine } from '../../utils/chatEngine';
import { imageEngine } from '../../utils/imageEngine';
import { initialState } from '../../data/state';
import { normalizarConsorcioTabelaState } from '../../lib/flyerSchemas/consorcioTabela.schema';

export async function POST(req) {
  try {
    const body = await req.json();

    const message = body.message;
    const state =
      body.state && body.state.etapa
        ? body.state
        : initialState;

    const chatResult = chatEngine(message, state);

    // 🔹 fluxo normal do chat
    if (chatResult.state.etapa !== 'FINAL') {
      return Response.json(chatResult);
    }

    // 🔹 normalização do state final
    let finalState = chatResult.state;

    if (finalState.flyerTipo === 'CONSORCIO_TABELA') {
      finalState = normalizarConsorcioTabelaState(finalState);
    }

    // 🔹 geração de imagem
    const imageResult = await imageEngine(finalState);

    if (!imageResult.ok) {
      return Response.json({
        resposta: imageResult.error,
        state: finalState
      });
    }

    return Response.json({
      resposta: 'Flyer gerado com sucesso.',
      imageBase64: imageResult.imageBase64,
      state: finalState
    });

  } catch (error) {
    console.error('🔥 ERRO REAL:', error);

    return Response.json({
      resposta: 'Erro inesperado.',
      state: initialState
    });
  }
}