import { chatEngine } from '../../utils/chatEngine';
import { imageEngine } from '../../utils/imageEngine';
import { initialState } from '../../data/state';

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message;
    const state = body.state && body.state.etapa ? body.state : initialState;

    // 1️⃣ Processa mensagem do chat
    const chatResult = chatEngine(message, state);

    // 2️⃣ Se não final, retorna apenas a mensagem
    if (chatResult.state.etapa !== 'FINAL') {
      return Response.json(chatResult);
    }

    // 3️⃣ Gera imagem
    const imageResult = await imageEngine(chatResult.state);

    if (!imageResult.ok) {
      return Response.json({
        resposta: imageResult.error || 'Erro ao gerar imagem.',
        state: chatResult.state
      });
    }

    // 4️⃣ Retorna mensagem + imagem base64
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