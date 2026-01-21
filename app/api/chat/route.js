import { chatEngine } from '../../utils/chatEngine';
import { imageEngine } from '../../utils/imageEngine';
import { initialState } from '../../data/state';

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message;
    const state = body.state || initialState;

    const chatResult = chatEngine(message, state);

    if (chatResult.state.etapa !== 'FINAL') {
      return Response.json(chatResult);
    }

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
    console.error(error);
    return Response.json({
      resposta: 'Erro inesperado.',
      state: initialState
    });
  }
}