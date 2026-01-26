import { estadoInicial } from '../../data/state';
import { chatEngine } from '../../utils/chatEngine';
import { templateFinancas } from '../../utils/templateEngine';
import { gerarImagem } from '../../utils/imageGenerator';
export async function POST(req) {
  let body, mensagem, estado;

  try {
    body = await req.json();
    mensagem = String(body.mensagem || '');
    estado = body.estado?.etapa ? body.estado : estadoInicial;
  } catch (err) {
    return new Response(
      JSON.stringify({
        resposta: 'Erro ao ler a requisição.',
        estado: estadoInicial
      }),
      { status: 200 }
    );
  }

  let resultadoChat;
  try {
    resultadoChat = chatEngine(mensagem, estado);
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        resposta: 'Erro interno no chat.',
        estado: estadoInicial
      }),
      { status: 200 }
    );
  }

  // Se ainda não é hora de gerar flyer, só responde o chat
  if (!resultadoChat.estado.prontoParaGerar) {
    return new Response(JSON.stringify(resultadoChat), { status: 200 });
  }

  // === GERA TEMPLATE ===
  const template = templateFinancas(resultadoChat.estado);

  // === GERA IMAGEM ===
  let imagem;
  try {
    imagem = await gerarImagem(template);
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        resposta: 'Erro ao gerar a imagem.',
        estado: resultadoChat.estado
      }),
      { status: 200 }
    );
  }

  return new Response(
    JSON.stringify({
      resposta: 'Flyer gerado com sucesso.',
      imageBase64: imagem,
      estado: resultadoChat.estado
    }),
    { status: 200 }
  );
}