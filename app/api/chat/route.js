import { estadoInicial } from '@/data/state';
import { chatEngine } from '@/utils/chatEngine';
import { templateFinancas } from '@/utils/templateEngine';
import { gerarImagem } from '@/utils/imageGenerator';

export async function POST(req) {
  const body = await req.json();
  let estado = body.estado || estadoInicial;

  const resultado = chatEngine(body.mensagem, estado);

  if (resultado.estado.prontoParaGerar) {
    const template = templateFinancas(resultado.estado);
    const imagem = await gerarImagem(template);

    return new Response(JSON.stringify({
      resposta: 'Flyer gerado com sucesso.',
      preview: imagem,
      estado: resultado.estado
    }), { status: 200 });
  }

  return new Response(JSON.stringify(resultado), { status: 200 });
}