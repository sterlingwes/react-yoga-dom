import React from 'react';
import puppeteer from 'puppeteer';

const initializePage = async page => {
  await page.setContent('<body></body>');
  await page.addScriptTag({
    path: './src/integration-tests/test-bundle.js',
  });
};

describe('Button', () => {
  let browser;
  let page;

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    page.on('console', msg => console.log('page>', msg.args()));
    page.on('error', err => console.log('page!>', err));
    page.on('pageerror', err => console.log('page!>', err));
    await initializePage(page);
    await page.addScriptTag({
      content: "renderComponent(React.createElement('div', null, 'Hello there world!'));",
    });
  });

  afterEach(async () => {
    await browser.close();
  });

  it('should', async () => {
    await page.waitFor(1000);
    const image = await page.screenshot();
    // @ts-ignore
    expect(image).toMatchImageSnapshot();
  });
});
