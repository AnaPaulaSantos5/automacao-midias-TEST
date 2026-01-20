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
  } catch (err) {
    return {
      ok: false,
      provider: null,
      error: 'Erro ao gerar prompt'
    };
  }

  /* =========================
     3. SWITCH DE PROVIDER
  ========================= */
  try {
    switch (provider) {
      case IMAGE_PROVIDERS.DALLE:
        return await gerarImagemDalle(prompt);

      case IMAGE_PROVIDERS.GEMINI:
        return await gerarImagemGemini(prompt);

      case IMAGE_PROVIDERS.NANO:
        return await gerarImagemNano(prompt);

      default:
        return {
          ok: false,
          provider,
          error: 'Provider de imagem não suportado'
        };
    }
  } catch (error) {
  console.error('[IMAGE ENGINE ERROR]', error);

  return {
    ok: false,
    provider,
    error: error.message || 'Falha na geração da imagem'
  };
}