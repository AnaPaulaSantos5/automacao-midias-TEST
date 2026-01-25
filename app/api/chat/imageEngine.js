import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import FlyerConsorcioTabela from '../../components/flyers/FlyerConsorcioTabela';
import { gerarImagem } from './gerarImagem'; // Puppeteer, mesmo nível ou utils separado

export async function imageEngine(state) {
  try {
    let FlyerComponent = null;

    if (state.flyerTipo === 'CONSORCIO_TABELA') {
      FlyerComponent = FlyerConsorcioTabela;
    } else {
      return { ok: false, error: 'Tipo de flyer não reconhecido.' };
    }

    const element = createElement(FlyerComponent, { data: state });
    const html = renderToStaticMarkup(element);
    const imageBase64 = await gerarImagem(html);

    return { ok: true, imageBase64 };
  } catch (error) {
    console.error('❌ Erro no imageEngine:', error);
    return { ok: false, error: 'Erro ao gerar imagem.' };
  }
}