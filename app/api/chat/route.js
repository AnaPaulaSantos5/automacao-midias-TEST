import { chatEngine } from '../../utils/chatEngine';
import { imageEngine } from '../../utils/imageEngine';
import { initialState } from '../../data/state';
export async function POST(req) {
  try {
    const body = await req.json();
    const { message, state = initialState } = body;

    // 1. Processa conversa
    const result = chatEngine(message, state);

    // 2. Se ainda não é final, só responde
    if (result.state.etapa !== 'FINAL') {
      return Response.json(result);
    }

    // 3. Geração da imagem
    const imageResult = await imageEngine(result.state);

    if (!imageResult.ok) {
      return Response.json({
        resposta: imageResult.error,
        state: result.state
      });
    }

    return Response.json({
      resposta: 'Flyer gerado com sucesso.',
      imageUrl: imageResult.imageUrl,
      state: result.state
    });

  } catch (error) {
    console.error('[CHAT API ERROR]', error);

    return Response.json({
      resposta: 'Erro inesperado. Vamos começar de novo.',
      state: initialState
    });
  }
}