export async function POST(req) {
  try {
    console.log('>>> API CHAT CHAMADA');

    const body = await req.json();
    console.log('BODY:', body);

    const state =
      body?.state && body.state.etapa
        ? body.state
        : initialState;

    console.log('STATE FINAL:', state);

    const chatResult = chatEngine(body.message, state);
    console.log('CHAT RESULT:', chatResult);

    if (chatResult.state.etapa !== 'FINAL') {
      return Response.json(chatResult);
    }

    const imageResult = await imageEngine(chatResult.state);

    return Response.json({
      resposta: 'Flyer gerado com sucesso.',
      imageBase64: imageResult.imageBase64,
      state: chatResult.state
    });

  } catch (error) {
    console.error('🔥 ERRO REAL:', error);

    return Response.json({
      resposta: 'Erro inesperado.',
      state: initialState
    });
  }
}