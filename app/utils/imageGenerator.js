import nodeHtmlToImage from 'node-html-to-image';

export async function gerarImagem(html) {
  const image = await nodeHtmlToImage({
    html,
    type: 'png',
    encoding: 'base64',
    quality: 100,
    puppeteerArgs: {
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });

  return image;
}