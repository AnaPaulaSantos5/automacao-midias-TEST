import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function gerarImagemDalle(prompt) {
  const result = await openai.images.generate({
    model: 'gpt-image-1',
    prompt,
    size: '1024x1024'
  });

  return {
    ok: true,
    provider: 'dalle',
    prompt,
    imageUrl: result.data[0].url
  };
}