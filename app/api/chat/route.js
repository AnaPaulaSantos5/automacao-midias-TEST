import { chatEngine } from '../../utils/chatEngine';
import { imageEngine } from '../../utils/imageEngine';
import { IMAGE_PROVIDERS } from '../../utils/imageProviders';
import { initialState } from '../../data/state';

export async function POST(req) {
  try {
    const body = await req.json();

    const message = body.message ?? '';
    const state = body.state ?? initialState;

    // 1. Processa conversa
    const result = chatEngine(message, state);

    // 2. Se chegou no FINAL, gera imagem
    if (result.state?.etapa === 'FINAL') {
      const imageResult = await imageEngine(
        result.state,
        IMAGE_PROVIDERS.DALLE
      );

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
    }

    // 3. Fluxo normal (continua conversa)
    return Response.json({
      resposta: result.resposta,
      state: result.state
    });

  } catch (error) {
    console.error('Erro na API /chat:', error);

    return Response.json({
      resposta: 'Erro inesperado. Vamos começar de novo.',
      state: initialState
    });
  }
}
