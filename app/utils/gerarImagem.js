import puppeteer from 'puppeteer';

export async function gerarImagem(html) {
  const browser = await puppeteer.launch({
    headless: 'new'
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 360,
    height: 640,
    deviceScaleFactor: 2
  });

  await page.setContent(`
    <html>
      <head>
        <style>
          body {
            margin: 0;
            background: #000;
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `);

  const buffer = await page.screenshot({
    type: 'png',
    encoding: 'base64'
  });

  await browser.close();

  return buffer;
}