import { gerarImagem } from './gerarImagem';

export async function imageEngine(state) {
  try {
    if (state.flyerTipo !== 'CONSORCIO_TABELA') {
      return { ok: false, error: 'Tipo de flyer não reconhecido.' };
    }

    // template HTML puro, sem React
    const html = `
      <div style="width:360px; font-family:Causten,sans-serif; background:#000; color:#fff;">
        <div style="height:25%; position:relative; overflow:hidden;">
          <img src="data:image/png;base64,${state.imageBase64}" 
               style="width:100%; height:100%; object-fit:cover;" />
          <div style="position:absolute; left:0; top:0; width:25%; height:100%; background:linear-gradient(to right, rgba(0,0,0,0.4), transparent)"></div>
          <div style="position:absolute; right:0; top:0; width:25%; height:100%; background:linear-gradient(to left, rgba(0,0,0,0.4), transparent)"></div>

          <div style="position:absolute; top:16px; left:16px;">
            <div style="font-weight:700; font-size:18px;">${state.subproduto}</div>
            <div style="font-size:14px;">${state.meses} meses</div>
          </div>

          <div style="position:absolute; right:16px; bottom:16px; text-align:right;">
            ${state.campanha?.textoPrincipal || ''}
          </div>
        </div>

        <div style="padding:16px; background:#000;">
          <table style="width:100%; border-collapse:collapse; background:#fff; border-radius:12px; overflow:hidden;">
            <thead>
              <tr>
                ${state.tabela.colunas.map((col, i) => `<th style="color:#fff; padding:8px;">${col}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${state.tabela.linhas.map(linha => {
                return `<tr>${linha.split('|').map(cell => `<td style="text-align:center;padding:8px;color:#000;">${cell.trim()}</td>`).join('')}</tr>`;
              }).join('')}
            </tbody>
          </table>

          <div style="margin-top:8px; text-align:center; color:#fff;">
            ${state.lances?.join(' • ') || ''}
          </div>

          <div style="margin-top:8px; font-size:10px; color:#ccc; text-align:center;">
            ${state.rodapeLegal || ''}
          </div>
        </div>
      </div>
    `;

    const imageBase64 = await gerarImagem(html);

    return { ok: true, imageBase64 };

  } catch (error) {
    console.error('❌ Erro no imageEngine:', error);
    return { ok: false, error: 'Erro ao gerar imagem.' };
  }
}