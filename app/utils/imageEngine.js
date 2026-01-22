import { validarState } from './stateValidator';
import { gerarPrompt } from './gerarPrompt';
import { IMAGE_PROVIDERS } from './imageProviders';

import { gerarImagemDalle } from './providers/dalle';
import { gerarImagemGemini } from './providers/gemini';
import { gerarImagemNano } from './providers/nano';

/**
 * Gera imagem em base64 a partir do estado.
 * Converte URL para base64 se necessário.
 */
export async function imageEngine(state, provider = IMAGE_PROVIDERS.DALLE) {
  // 1️⃣ Validação do state
  const validation = validarState(state);
  if (!validation.ok) {
    return { ok: false, error: validation.errors.join(' | ') };
  }

  // 2️⃣ Gerar prompt
  let prompt;
  try {
    prompt = gerarPrompt(state);
  } catch {
    return { ok: false, error: 'Erro ao gerar prompt' };
  }

// 3️⃣ Gerar imagem
try {
  let image = null;

  switch (provider) {
    case IMAGE_PROVIDERS.DALLE:
      image = await gerarImagemDalle(prompt);
      break;

    case IMAGE_PROVIDERS.GEMINI:
      image = await gerarImagemGemini(prompt);
      break;

    case IMAGE_PROVIDERS.NANO:
      image = await gerarImagemNano(prompt);
      break;

    default:
      return { ok: false, error: 'Provider não suportado' };
  }

  if (!image) return { ok: false, error: 'Imagem não retornada pelo provider' };

  console.log('🔹 Image retornada pelo provider:', image, typeof image);

  // Se for URL, converte para base64
  let imageBase64 = image;
  if (typeof image === 'string' && image.startsWith('http')) {
    const res = await fetch(image);
    const buffer = await res.arrayBuffer();
    imageBase64 = Buffer.from(buffer).toString('base64');
  }

  return { ok: true, imageBase64 };

} catch (error) {
  console.error('[IMAGE ENGINE ERROR]', error);
  return { ok: false, error: error.message || 'Falha na geração da imagem' };
}
