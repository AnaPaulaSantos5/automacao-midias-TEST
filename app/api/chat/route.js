import { chatEngine } from '../../utils/chatEngine';
import { imageEngine } from '../../utils/imageEngine';
import { IMAGE_PROVIDERS } from '../../utils/imageProviders';
import { initialState } from '../../data/state';

export async function POST(req) {
  try {
    const body = await req.json();

    const message = body.message ?? '';
    const state = body.state ?? initialState;

    // 1️⃣ Conversa
    const result = chatEngine(message, state);

    // 2️⃣ Se chegou no FINAL → gerar imagem
    if (result.state?.etapa === 'FINAL') {
      const imageResult = await imageEngine(
        result.state,
        IMAGE_PROVIDERS.DALLE
      );

      if (!imageResult.ok) {
        return Response.json({
          resposta: imageResult.error,
          state: result.state
        });
      }

      return Response.json({
        resposta: 'Flyer gerado com sucesso.',
        imageUrl: imageResult.imageUrl,
