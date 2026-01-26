import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function gerarImagem(template) {
  const prompt = `
Flyer institucional profissional.
Marca: ${template.marca}
Paleta: ${template.paleta.join(', ')}
Layout: consórcio com tabela central
Imagem temática: ${template.imagem.tema}
Texto principal: ${template.textos.titulo}
Texto auxiliar: ${template.textos.subtitulo}
Tabela central com cores específicas.
Estilo limpo, realista, corporativo.
`;

  const result = await openai.images.generate({
    model: 'gpt-image-1',
    prompt,
    size: '1024x1024'
  });

  return result.data[0].url;
}