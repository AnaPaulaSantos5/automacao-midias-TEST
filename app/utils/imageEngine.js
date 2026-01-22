import { validarState } from './stateValidator';
import { gerarPrompt } from './gerarPrompt';
import { IMAGE_PROVIDERS } from './imageProviders';

import { gerarImagemDalle } from './providers/dalle';

export async function imageEngine(state, provider = IMAGE_PROVIDERS.DALLE) {
  const validation = validarState(state);

  if (!validation.ok) {
    return { ok: false, error: validation.errors.join(' | ') };
  }

  let prompt;
  try {
    prompt = gerarPrompt(state);
  } catch (e) {
    return { ok: false, error: 'Erro ao gerar prompt' };
  }

  try {
    const imageBase64 = await gerarImagemDalle(prompt);

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return { ok: false, error: 'Imagem inválida retornada' };
    }

    return {
      ok: true,
      imageBase64
    };
  } catch (error) {
    console.error('[IMAGE ENGINE ERROR]', error);
    return { ok: false, error: 'Falha ao gerar imagem' };
  }
}