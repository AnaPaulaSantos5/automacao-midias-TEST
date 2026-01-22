export function gerarCopySeguroResidencial() {
  const frasesPrincipais = [
    'Segurança e tranquilidade para o seu lar.',
    'Seu lar protegido para você viver com tranquilidade.',
    'Mais segurança para sua casa. Mais tranquilidade para você.',
    'Proteção que traz tranquilidade todos os dias.',
    'Cuidamos do seu lar para você viver com mais segurança.'
  ];

  const complementares = [
    'Porque seu patrimônio merece cuidado.',
    'Proteção pensada para o dia a dia.',
    'Tranquilidade para hoje e para o futuro.',
    'Segurança que acompanha sua rotina.',
    'Confiança para viver sem preocupações.'
  ];

  const principal =
    frasesPrincipais[Math.floor(Math.random() * frasesPrincipais.length)];

  const complementar =
    complementares[Math.floor(Math.random() * complementares.length)];

  return {
    textoPrincipal: principal,
    textoComplementar: complementar
  };
}