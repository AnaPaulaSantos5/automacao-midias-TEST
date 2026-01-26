import { estadoInicial } from '../../data/state';
import { chatEngine } from '../../utils/chatEngine';
import { templateConsorcioTabela } from '../../utils/templateEngine';
import { gerarImagemSVG } from '../../utils/imageGenerator';

export async function POST(req) {
  const body = await req.json();
  const estado = body.estado || estadoInicial;

  const resultado = chatEngine(body.mensagem, estado);

  if (resultado.estado.etapa !== 'FINAL') {
    return Response.json(resultado);
  }

  const template = templateConsorcioTabela(resultado.estado);
  const svg = gerarImagemSVG(template);

  return Response.json({
    resposta: resultado.resposta,
    estado: resultado.estado,
    image: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
  });
}