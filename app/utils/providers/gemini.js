export async function gerarImagemGemini(prompt) {
  return {
    ok: false,
    provider: 'gemini',
    prompt,
    error: 'Provider Gemini ainda não conectado'
  };
}