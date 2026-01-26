import { estadoInicial } from '../../data/state';
import { chatEngine } from '../../utils/chatEngine';
import { templateFinancas } from '../../utils/templateEngine';
import { gerarImagem } from '../../utils/imageGenerator';

export async function POST(req) {
  const body = await req.json();

  const mensagem = body.mensagem || '';
  const estado = body.estado || estadoInicial;

  const resultado = chatEngine(mensagem, estado);

  // 🔹 Chat ainda em andamento
  if (resultado.estado.etapa !== 'FINAL') {
    return new Response(JSON.stringify(resultado), { status: 200 });
  }

  // 🔹 FINAL → GERA FLYER
  const html = templateFinancas(resultado.estado);
  const imageBase64 = await gerarImagem(html);

  return new Response(JSON.stringify({
    resposta: 'Flyer gerado com sucesso.',
    estado: resultado.estado,
    imageBase64
  }), { status: 200 });
}