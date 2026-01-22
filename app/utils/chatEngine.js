import { validarState } from './stateValidator';
import { gerarPrompt } from './gerarPrompt';
import { IMAGE_PROVIDERS } from './imageProviders';

import { gerarImagemDalle } from './providers/dalle';
import { gerarImagemGemini } from './providers/gemini';
import { gerarImagemNano } from './providers/nano';

export async function imageEngine(
  state,
  provider = IMAGE_PROVIDERS.DALLE
) {
  const validation = validarState(state);

  if (!validation.ok) {
    return {
      ok: false,
      error: validation.errors.join(' | ')
    };
  }

  let prompt;
  try {
    prompt = gerarPrompt(state);
  } catch {
    return {
      ok: false,
      error: 'Erro ao gerar prompt'
    };
  }

  try {
    let imageBase64;

    switch (provider) {
      case IMAGE_PROVIDERS.DALLE:
        imageBase64 = await gerarImagemDalle(prompt);
        break;

      case IMAGE_PROVIDERS.GEMINI:
        imageBase64 = await gerarImagemGemini(prompt);
        break;

      case IMAGE_PROVIDERS.NANO:
        imageBase64 = await gerarImagemNano(prompt);
        break;

      default:
        return {
          ok: false,
          error: 'Provider não suportado'
        };
    }

    if (!imageBase64) {
      return {
        ok: false,
        error: 'Imagem não retornada pelo provider'
      };
    }

    return {
      ok: true,
      imageBase64 // BASE64 PURO
    };

  } catch (error) {
    console.error('[IMAGE ENGINE ERROR]', error);

    return {
      ok: false,
      error: error.message || 'Falha na geração da imagem'
    };
  }
}