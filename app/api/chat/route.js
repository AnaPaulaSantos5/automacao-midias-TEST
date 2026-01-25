import { chatEngine } from '../utils/chatEngine'; // se chatEngine está no mesmo nível
import { imageEngine } from './imageEngine'; // se imageEngine está no mesmo nível
import { initialState } from '../../data/state'; // caminho corrigido
import { normalizarStateFinal } from '../../utils/normalizarStateFinal';

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message;
    const state = body.state && body.state.etapa ? body.state : initialState;

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
    console.error('🔥 ERRO REAL:', error);
    return Response.json({
      resposta: 'Erro inesperado.',
      state: initialState
    });
  }
}