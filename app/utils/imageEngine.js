import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import FlyerConsorcioTabela from '../components/flyers/FlyerConsorcioTabela';
import { gerarImagem } from './gerarImagem'; // seu arquivo que chama puppeteer

export async function imageEngine(state) {
  try {
    let FlyerComponent = null;

    // 🔹 escolha do flyer pelo tipo
    switch (state.flyerTipo) {
      case 'CONSORCIO_TABELA':
        FlyerComponent = FlyerConsorcioTabela;
        break;

      default:
        return { ok: false, error: 'Tipo de flyer não reconhecido.' };
    }

    // 🔹 renderiza o componente
    const element = createElement(FlyerComponent, { data: state });
    const html = renderToStaticMarkup(element);

    // 🔹 converte HTML → imagem base64
    const imageBase64 = await gerarImagem(html);

    return { ok: true, imageBase64 };

  } catch (error) {
    console.error('❌ Erro no imageEngine:', error);
    return { ok: false, error: 'Erro ao gerar imagem.' };
  }
}