export default function FlyerConsorcioTabela({ data }) {
  const {
    imageBase64,
    subproduto,
    meses,
    campanha,
    tabela,
    lances,
    rodapeLegal
  } = data;

  const campanhaSplit = campanha.textoPrincipal.match(/(\d+%)/);

  return (
    <div style={styles.flyer}>
      
      {/* IMAGEM */}
      <div style={styles.imageWrapper}>
        <img
          src={`data:image/png;base64,${imageBase64}`}
          style={styles.image}
        />

        {/* overlays */}
        <div style={styles.overlayLeft} />
        <div style={styles.overlayRight} />

        {/* produto / meses */}
        <div style={styles.produtoBox}>
          <div style={styles.produto}>{capitalize(subproduto)}</div>
          <div style={styles.meses}>{meses} meses</div>
        </div>

        {/* campanha */}
        <div style={styles.campanhaBox}>
          {campanhaSplit ? (
            <>
              <div style={styles.campanhaSmall}>Parcelas</div>
              <div style={styles.campanhaBig}>{campanhaSplit[1]}</div>
              <div style={styles.campanhaSmall}>
                {campanha.textoPrincipal.replace(campanhaSplit[1], '').trim()}
              </div>
            </>
          ) : (
            <div style={styles.campanhaBig}>{campanha.textoPrincipal}</div>
          )}
        </div>
      </div>

      {/* FUNDO PRETO */}
      <div style={styles.content}>

        {/* TABELA */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                {tabela.colunas.map((col, i) => (
                  <th key={i} style={{ ...styles.th, background: headerColors[i] }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tabela.linhas.map((linha, i) => (
                <tr key={i}>
                  {linha.split('|').map((cell, j) => (
                    <td key={j} style={styles.td}>{cell.trim()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* LANCES */}
        {lances?.length > 0 && (
          <div style={styles.lances}>
            {lances.join(' • ')}
          </div>
        )}

        {/* RODAPÉ */}
        <div style={styles.rodape}>
          {rodapeLegal}
        </div>
      </div>
    </div>
  );
}