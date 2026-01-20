import { imageEngine } from '@/app/utils/imageEngine';
import { IMAGE_PROVIDERS } from '@/app/utils/imageProviders';

...

if (result.state.etapa === 'FINAL') {
  const imageResult = await imageEngine(result.state, IMAGE_PROVIDERS.DALLE);

  if (!imageResult.ok) {
    return Response.json({
      resposta: imageResult.error,
      state: result.state
    });
  }

  return Response.json({
    resposta: 'Imagem gerada com sucesso.',
    imageUrl: imageResult.imageUrl,
    state: result.state
  });
}