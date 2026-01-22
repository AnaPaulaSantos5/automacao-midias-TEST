
export async function imageEngine(state, provider = IMAGE_PROVIDERS.DALLE) {
  const validation = validarState(state);

  if (!validation.ok) {
    return { ok: false, error: validation.errors.join(' | ') };
  }

  let prompt;
  try {
    prompt = gerarPrompt(state);
  } catch {
    return { ok: false, error: 'Erro ao gerar prompt' };
  }

  try {
    let result;

    switch (provider) {
      case IMAGE_PROVIDERS.DALLE:
        result = await gerarImagemDalle(prompt);
        break;
      case IMAGE_PROVIDERS.GEMINI:
        result = await gerarImagemGemini(prompt);
        break;
      case IMAGE_PROVIDERS.NANO:
        result = await gerarImagemNano(prompt);
        break;
      default:
        return { ok: false, error: 'Provider não suportado' };
    }

    if (!result) {
      return { ok: false, error: 'Imagem não retornada pelo provider' };
    }

    // 🔥 NORMALIZAÇÃO CRÍTICA
    let imageBase64;

    if (typeof result === 'string') {
      imageBase64 = result;
    } else if (result.imageBase64) {
      imageBase64 = result.imageBase64;
    } else if (result.data) {
      imageBase64 = result.data;
    } else if (result.b64_json) {
      imageBase64 = result.b64_json;
    } else {
      console.error('Formato inválido:', result);
      return { ok: false, error: 'Formato de imagem inválido' };
    }

    return {
      ok: true,
      imageBase64
    };

  } catch (error) {
    console.error('[IMAGE ENGINE ERROR]', error);
    return { ok: false, error: error.message };
  }
}
