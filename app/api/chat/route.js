import { chatEngine } from '../../utils/chatEngine';
import { gerarPrompt } from '../../utils/gerarPrompt';
import { initialState } from '../../utils/initialState';

let state = { ...initialState };

export async function POST(req) {
  const { message } = await req.json();

  const resposta = chatEngine(message, state);

  // Se chegou ao fim do fluxo, gera o prompt
  if (state.etapa === 'FINAL') {
    const promptFinal = gerarPrompt(state);

    return Response.json({
      reply: resposta,
      prompt: promptFinal,
      state
    });
  }

  return Response.json({
    reply: resposta,
    state
  });
}