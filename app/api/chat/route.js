import { chatEngine } from '../../utils/chatEngine';
import { initialState } from '../../data/state';

export async function POST(req) {
  try {
    const { message, state } = await req.json();

    const result = chatEngine(message, state);

    if (!result?.state || !result?.resposta) {
      return Response.json({
        resposta: 'Erro interno. Reiniciando conversa.',
        state: initialState
      });
    }

    return Response.json(result);
  } catch (error) {
    return Response.json({
      resposta: 'Erro inesperado. Vamos começar de novo.',
      state: initialState
    });
  }
}