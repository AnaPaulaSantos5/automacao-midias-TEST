export function templateConsorcioTabela(estado) {
  return {
    titulo: estado.campanha.textoPrincipal,
    subtitulo: estado.campanha.textoAuxiliar,
    meses: estado.meses,

    tabela: estado.tabela,
    lances: estado.lances,
    rodape: estado.rodape
  };
}