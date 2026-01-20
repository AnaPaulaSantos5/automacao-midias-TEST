export async function gerarImagemNano(prompt) {
  return {
    ok: false,
    provider: 'nano',
    prompt,
    error: 'Provider Nano ainda não conectado'
  };
}