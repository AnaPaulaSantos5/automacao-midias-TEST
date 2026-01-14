import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function loadPrompt(fileName: string) {
  const filePath = path.join(process.cwd(), "prompts", fileName);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}

function identificarPedido(mensagem: string) {
  const texto = mensagem.toLowerCase();

  if (texto.includes("residencial")) {
    return { marca: "seguros", produto: "residencial" };
  }

  if (texto.includes("odonto")) {
    return { marca: "beneficios", produto: "odonto" };
  }

  if (texto.includes("saúde") || texto.includes("saude")) {
    return { marca: "beneficios", produto: "saude" };
  }

  if (texto.includes("pet")) {
    return { marca: "beneficios", produto: "pet" };
  }

  if (texto.includes("consórcio") || texto.includes("consorcio")) {
    return { marca: "financas", produto: "consorcio" };
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mensagem = body.mensagem;

    if (!mensagem) {
      return NextResponse.json(
        { erro: "Mensagem não enviada" },
        { status: 400 }
      );
    }

    const pedido = identificarPedido(mensagem);

    if (!pedido) {
      return NextResponse.json(
        { erro: "Não foi possível identificar o tipo de flyer" },
        { status: 400 }
      );
    }

    let promptBase;

    if (pedido.marca === "seguros") {
      promptBase = loadPrompt("confi-seguros.json");
      return NextResponse.json({
        marca: promptBase.marca,
        produto: "Seguro Residencial",
        paleta: promptBase.paleta,
        conteudo: promptBase.produtos.residencial.textos,
        beneficios: promptBase.produtos.residencial.beneficios,
        layoutBase: promptBase.produtos.residencial.layoutBase
      });
    }

    if (pedido.marca === "beneficios") {
      promptBase = loadPrompt("confi-beneficios.json");
      const produto = promptBase.produtos[pedido.produto];

      return NextResponse.json({
        marca: promptBase.marca,
        produto: pedido.produto,
        paleta: promptBase.paleta,
        conteudo: produto.textos,
        beneficios: produto.beneficios || [],
        layoutBase: produto.layoutBase
      });
    }

    if (pedido.marca === "financas") {
      promptBase = loadPrompt("confi-financas.json");

      return NextResponse.json({
        marca: promptBase.marca,
        produto: "Consórcio",
        paleta: promptBase.paleta,
        conteudo: promptBase.produtos.consorcio.textos,
        layoutBase: promptBase.produtos.consorcio.layoutBase
      });
    }

    return NextResponse.json(
      { erro: "Fluxo não tratado" },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      { erro: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}