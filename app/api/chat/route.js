import { chatEngine } from '../../utils/chatEngine';
import { imageEngine } from '../../utils/imageEngine';
import { initialState } from '../../data/state';

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body?.message;
    const state =
  body?.state && body.state.etapa
    ? body.state
    : initialState;

    if (!message) {
      return Response.json({
        resposta: 'Mensagem vazia.',
        state
      });
    }

    // 1. Chat flow
    const chatResult = chatEngine(message, state);

    // 2. Ainda conversando
    if (chatResult.state.etapa !== 'FINAL') {
      return Response.json(chatResult);
    }

    // 3. Geração da imagem
    const imageResult = await imageEngine(chatResult.state);

    if (!imageResult.ok) {
      return Response.json({
        resposta: imageResult.error || 'Erro ao gerar imagem.',
        state: chatResult.state
      });
    }

    // 4. Sucesso
    return Response.json({
      resposta: 'Flyer gerado com sucesso.',
      imageBase64: imageResult.imageBase64, // BASE64 PURO
      state: chatResult.state
    });

  } catch (error) {
    console.error('[CHAT ROUTE ERROR]', error);

    return Response.json({
      resposta: 'Erro inesperado.',
      state: initialState
    });
  }
}