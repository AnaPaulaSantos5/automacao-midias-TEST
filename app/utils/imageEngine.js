import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import FlyerConsorcioTabela from '../components/flyers/FlyerConsorcioTabela';

export async function imageEngine(state) {
  try {
    let FlyerComponent = null;

    // 🔹 escolha do flyer pelo tipo
    switch (state.flyerTipo) {
      case 'CONSORCIO_TABELA':
        FlyerComponent = FlyerConsorcioTabela;
        break;

      default:
        return {
          ok: false,
          error: 'Tipo de flyer não reconhecido.'
        };
    }

    // 🔹 renderização do componente
    const element = createElement(FlyerComponent, state);
    const html = renderToStaticMarkup(element);

    // 🔹 conversão HTML → imagem (base64)
    const imageBase64 = await gerarImagem(html);

    return {
      ok: true,
      imageBase64
    };

  } catch (error) {
    console.error('❌ Erro no imageEngine:', error);

    return {
      ok: false,
      error: 'Erro ao gerar imagem.'
    };
  }
}