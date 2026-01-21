import { chatEngine } from './app/utils/chatEngine';
import { initialState } from '../app/data/state';

export async function POST(req) {
  try {
    const body = await req.json();

    const message = body.message ?? '';
    const state = body.state ?? initialState;

    const result = chatEngine(message, state);

    return Response.json(result);
  } catch (error) {
    console.error('CHAT API ERROR:', error);

    return Response.json({
      resposta: 'Erro inesperado. Vamos começar de novo.',
      state: initialState
    });
  }
}
