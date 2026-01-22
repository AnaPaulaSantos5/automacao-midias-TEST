import { chatEngine } from '../../utils/chatEngine';
import { imageEngine } from '../../utils/imageEngine';
import { initialState } from '../../data/state';

export async function POST(req) {
  try {
    console.log('>>> API CHAT CHAMADA');

    const body = await req.json();
    console.log('BODY:', body);

    const state =
      body?.state && body.state.etapa
        ? body.state
        : initialState;

    console.log('STATE FINAL:', state);

    const chatResult = chatEngine(body.message, state);
    console.log('CHAT RESULT:', chatResult);

    // Se ainda não está na etapa FINAL, responde só com chat
    if (chatResult.state.etapa !== 'FINAL') {
      return Response.json(chatResult);
    }

    // Etapa FINAL → gera imagem
    const imageResult = await imageEngine(chatResult.state);

    if (!imageResult.ok) {
      return Response.json({
        resposta: imageResult.error || 'Erro ao gerar imagem.',
        state: chatResult.state
      });
    }

    return Response.json({
      resposta: 'Flyer gerado com sucesso.',
      imageBase64: imageResult.imageBase64, // base64 puro
      state: chatResult.state
    });

  } catch (error) {
    console.error('🔥 ERRO REAL:', error);
    return Response.json({
      resposta: 'Erro inesperado. Vamos começar novamente.',
      state: initialState
    });
  }
}