import { chatEngine } from '../../utils/chatEngine';
import { imageEngine } from '../../utils/imageEngine';
import { IMAGE_PROVIDERS } from '../../utils/imageProviders';
import { initialState } from '../../data/state';

export async function POST(req) {
  try {
    const { message, state } = await req.json();

    const result = chatEngine(message, state);

    if (!result || !result.state || !result.resposta) {
      return Response.json({
        resposta: 'Erro interno. Reiniciando conversa.',
        state: initialState
      });
    }

    /* =========================
       ETAPA FINAL → GERAR IMAGEM
    ========================= */
    if (result.state.etapa === 'FINAL') {
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
        resposta: 'Imagem gerada com sucesso.',
        imageUrl: imageResult.imageUrl,
        state: result.state
      });
    }

    /* =========================
       FLUXO NORMAL DO CHAT
    ========================= */
    return Response.json(result);

  } catch (error) {
    return Response.json({
      resposta: 'Erro inesperado. Vamos começar de novo.',
      state: initialState
    });
  }
}