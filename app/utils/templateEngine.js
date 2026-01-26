export function templateFinancas(estado) {
  return `
  <html>
    <body style="margin:0;font-family:Arial;background:#1260c7;color:white;">
      <div style="padding:30px;">
        <h1>${estado.campanha.textoPrincipal}</h1>
        <p>${estado.campanha.textoAuxiliar || ''}</p>

        <h3>Consórcio ${estado.subproduto} – ${estado.meses} meses</h3>

        <table style="width:100%;background:white;color:black;border-collapse:collapse;">
          <tr>
            ${estado.tabela.colunas.map(c =>
              `<th style="border:1px solid #000;padding:8px">${c}</th>`
            ).join('')}
          </tr>

          ${estado.tabela.linhas.map(l =>
            `<tr>${l.map(c =>
              `<td style="border:1px solid #000;padding:8px">${c}</td>`
            ).join('')}</tr>`
          ).join('')}
        </table>

        <p><strong>Lances:</strong> ${estado.lances.join(' • ')}</p>

        <small>${estado.rodape}</small>
      </div>
    </body>
  </html>
  `;
}