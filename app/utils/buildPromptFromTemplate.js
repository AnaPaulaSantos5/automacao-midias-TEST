/**
 * buildPromptFromTemplate.js
 * Converte o contexto final do chat em prompt estruturado para geração de imagem.
 */

export function buildPromptFromTemplate(context) {
  let prompt = '';

  switch (context.produto) {
    case 'consorcio':
      prompt = `Flyer de consórcio ${context.subproduto} - ${context.meses} meses
Campanha: ${context.campanha}
Texto principal: ${context.textoPrincipal || 'gerar automaticamente'}
Texto complementar: ${context.textoComplementar || 'nenhum'}
Tabela: ${JSON.stringify(context.tabela)}`;
      break;

    case 'residencial':
    case 'auto':
    case 'vida':
      prompt = `Flyer de seguro ${context.produto} Confi Seguros
Texto principal: ${context.textoPrincipal || 'gerar automaticamente'}
Layout institucional: cores #ffce0a/#ffffff/#000000, CTA visível, curva de proteção, painel com blur`;
      break;

    case 'saude':
    case 'odonto':
    case 'pet':
      prompt = `Flyer Confi Benefícios: ${context.produto}
Texto principal: ${context.textoPrincipal || 'gerar automaticamente'}
Benefícios: ${context.beneficios ? context.beneficios.join(', ') : 'usar padrão'}
Layout institucional: paleta #f5886c/#ffffff/#000000, curva coral, elementos arredondados`;
      break;

    default:
      prompt = 'Flyer genérico Confi';
      break;
  }

  return prompt;
}