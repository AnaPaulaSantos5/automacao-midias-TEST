import { chatEngine } from '../../utils/chatEngine';
import { imageEngine } from '../../utils/imageEngine';
import { initialState } from '../../data/state';

export async function POST(req) {
  try {
    /* =========================
       1. LEITURA SEGURA DO BODY
    ========================= */
    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({
        resposta: 'Erro ao ler mensagem.',
        state: initialState
      });
    }

    const message = body?.message;
    const state = body?.state || initialState;

    if (!message) {
      return Response.json({
        resposta: 'Mensagem vazia.',
        state
      });
    }

    /* =========================
       2. CHAT ENGINE
    ========================= */
    const chatResult = chatEngine(message, state);

    /* =========================
       3. SE NÃO É FINAL, RESPONDE
    ========================= */
    if (chatResult.state.etapa !== 'FINAL') {
      return Response.json(chatResult);
    }

    /* =========================
       4. GERA IMAGEM
    ========================= */
    const imageResult = await imageEngine(chatResult.state);

    if (!imageResult.ok) {
      return Response.json({
        resposta: imageResult.error || 'Erro ao gerar imagem.',
        state: chatResult.state
      });
    }

    /* =========================
       5. SUCESSO FINAL
    ========================= */
    return Response.json({
      resposta: 'Flyer gerado com sucesso.',
      imageUrl: imageResult.url || imageResult.imageUrl,
      state: chatResult.state
    });

  } catch (error) {
    console.error('[CHAT ROUTE ERROR]', error);

    return Response.json({
      resposta: 'Erro inesperado. Vamos começar de novo.',
      state: initialState
    });
  }
}