import OpenAI from 'openai';

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada');
  }

  return new OpenAI({ apiKey });
}

export async function gerarImagemDalle(prompt) {
  const openai = getClient();

  const result = await openai.images.generate({
    model: 'gpt-image-1',
    prompt,
    size: '1024x1024'
  });

  return {
    ok: true,
    provider: 'DALLE',
    imageUrl: result.data[0].url,
    prompt
  };
}