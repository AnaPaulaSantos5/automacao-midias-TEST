import { normalizarCanal, normalizarFormato } from "./normalizacao";
import { resolverProduto } from "./resolverProduto";
import { gerarPrompt } from "./promptBuilder";

export function chatEngine(texto, estado) {
  let state = { ...estado };
  let reply = "";
  let prompt = null;

  // RESET AUTOMÁTICO SE DETECTAR NOVO PRODUTO
  const novoProduto = resolverProduto(texto);
  if (novoProduto && novoProduto !== state.produto) {
    return {
      reply: "Esse flyer será para qual canal?",
      state: { produto: novoProduto, etapa: "canal" }
    };
  }

  switch (state.etapa) {
    case "inicio":
      reply = "Olá! Sou o Flyer AI. Me diga que tipo de flyer você deseja criar.";
      state.etapa = "produto";
      break;

    case "produto":
      if (!novoProduto) {
        reply = "Não consegui identificar o produto. Pode repetir?";
        break;
      }
      state.produto = novoProduto;
      state.etapa = "canal";
      reply = "Esse flyer será para qual canal?";
      break;

    case "canal":
      const canal = normalizarCanal(texto);
      if (!canal) {
        reply = "Pode ser Instagram ou WhatsApp.";
        break;
      }
      state.canal = canal;
      state.etapa = "formato";
      reply = "Qual formato você deseja? (1:1 | 4:5 | 9:16)";
      break;

    case "formato":
      const formato = normalizarFormato(texto);
      if (!formato) {
        reply = "Formato inválido. Pode ser 1:1, 4:5 ou 9:16.";
        break;
      }
      state.formato = formato;

      if (state.produto === "consorcio") {
        state.etapa = "modelo";
        reply = "Você prefere modelo A (sem tabela) ou B (com tabela)?";
      } else {
        state.etapa = "final";
      }
      break;

    case "modelo":
      state.modelo = texto.toUpperCase().includes("B") ? "B" : "A";

      if (state.modelo === "B") {
        state.etapa = "tabela";
        reply = "Informe o cabeçalho da tabela (separado por vírgula).";
      } else {
        state.etapa = "final";
      }
      break;

    case "tabela":
      state.tabela = {
        cabecalho: texto.split(",").map(t => t.trim()),
        valores: [],
        rodape: ""
      };
      state.etapa = "valores";
      reply = "Informe os valores da tabela (uma linha por mensagem).";
      break;

    case "valores":
      state.tabela.valores.push(texto);
      reply = "Deseja adicionar mais uma linha? (ou digite 'continuar')";
      state.etapa = "rodape";
      break;

    case "rodape":
      state.tabela.rodape = texto;
      state.etapa = "final";
      break;

    case "final":
      prompt = gerarPrompt(state);
      reply = "Perfeito! Aqui está o prompt do flyer.";
      break;
  }

  return { reply, state, prompt };
}