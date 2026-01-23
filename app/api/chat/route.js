import { chatEngine } from '../../utils/chatEngine';
import { imageEngine } from '../../utils/imageEngine';
import { initialState } from '../../data/state';
import { normalizarStateFinal } from '../../utils/normalizarStateFinal';

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

    // 🔹 geração de imagem
    const imageResult = await imageEngine(chatResult.state);

    if (!imageResult.ok) {
      return Response.json({
        resposta: imageResult.error,
        state: chatResult.state
      });
    }

    return Response.json({
      resposta: 'Flyer gerado com sucesso.',
      imageBase64: imageResult.imageBase64,
      state: chatResult.state
    });

  } catch (error) {
    console.error('🔥 ERRO REAL:', error);

    return Response.json({
      resposta: 'Erro inesperado.',
      state: initialState
    });
  }
}