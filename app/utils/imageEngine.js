import { validarState } from './stateValidator';
import { gerarPrompt } from './gerarPrompt';
import { IMAGE_PROVIDERS } from './imageProviders';

import { gerarImagemDalle } from './providers/dalle';
import { gerarImagemGemini } from './providers/gemini';
import { gerarImagemNano } from './providers/nano';

export async function imageEngine(state, provider = IMAGE_PROVIDERS.DALLE) {
  /* =========================
     1. VALIDAÇÃO RÍGIDA
  ========================= */
  const validation = validarState(state);

  if (!validation.ok) {
    return {
      ok: false,
      provider: null,
      error: validation.errors.join(' | ')
    };
  }

  /* =========================
     2. GERA PROMPT FINAL
  ========================= */
  let prompt;

  try {
    prompt = gerarPrompt(state);
  } catch {
    return {
      ok: false,
      provider: null,
      error: 'Erro ao gerar prompt'
    };
  }

  /* =========================
     3. GERA IMAGEM
  ========================= */
  try {
    let imageUrl;

    switch (provider) {
      case IMAGE_PROVIDERS.DALLE:
        imageUrl = await gerarImagemDalle(prompt);
        break;

      case IMAGE_PROVIDERS.GEMINI:
        imageUrl = await gerarImagemGemini(prompt);
        break;

      case IMAGE_PROVIDERS.NANO:
        imageUrl = await gerarImagemNano(prompt);
        break;

      default:
        return {
          ok: false,
          provider,
          error: 'Provider de imagem não suportado'
        };
    }

    if (!imageUrl) {
      return {
        ok: false,
        provider,
        error: 'Imagem não retornada pelo provider'
      };
    }

    return {
      ok: true,
      provider,
      imageUrl
    };

  } catch (error) {
    console.error('[IMAGE ENGINE ERROR]', error);

    return {
      ok: false,
      provider,
      error: error.message || 'Falha na geração da imagem'
    };
  }
}