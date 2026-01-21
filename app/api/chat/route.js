import { NextResponse } from 'next/server';
import { initialState } from '../../data/state';
import { gerarFlyerSeguroResidencial } from '../../utils/imageEngine';

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, state = initialState } = body;

    // FLUXO FINAL
    if (state.etapa === 'FINAL') {
      // 🔴 GERA A IMAGEM DE VERDADE
      const imageResult = await gerarFlyerSeguroResidencial(state);

      if (!imageResult || !imageResult.imageUrl) {
        return NextResponse.json({
          resposta: 'Erro ao gerar o flyer.',
          state
        });
      }

      return NextResponse.json({
        resposta: 'Flyer gerado com sucesso.',
        imageUrl: imageResult.imageUrl,
        state
      });
    }

    // Fluxo normal (simplificado)
    return NextResponse.json({
      resposta: 'Fluxo em andamento...',
      state
    });

  } catch (error) {
    console.error('Erro no chat:', error);

    return NextResponse.json(
      { resposta: 'Erro interno no servidor.' },
      { status: 500 }
    );
  }
}

