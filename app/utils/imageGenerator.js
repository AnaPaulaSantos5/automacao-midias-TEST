export function gerarImagemSVG(template) {
  return `
<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1080" fill="#000"/>

  <text x="60" y="120" fill="#ffffff" font-size="56" font-weight="bold">
    ${template.titulo}
  </text>

  <text x="60" y="180" fill="#ffffff" font-size="36">
    ${template.subtitulo || ''}
  </text>

  <rect x="40" y="240" width="1000" height="420" rx="24" fill="#ffffff"/>

  ${
    template.tabela.colunas.map((c, i) =>
      `<text x="${80 + i * 240}" y="290" fill="#000" font-size="28" font-weight="bold">${c}</text>`
    ).join('')
  }

  ${
    template.tabela.linhas.map((linha, y) =>
      linha.map((cell, x) =>
        `<text x="${80 + x * 240}" y="${340 + y * 60}" fill="#000" font-size="26">${cell}</text>`
      ).join('')
    ).join('')
  }

  ${
    template.lances.map((l, i) =>
      `<text x="60" y="${720 + i * 40}" fill="#ffffff" font-size="26">${l}</text>`
    ).join('')
  }

  <text x="60" y="1020" fill="#cccccc" font-size="18">${template.rodape}</text>
</svg>
`;
}