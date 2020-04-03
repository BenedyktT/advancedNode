const puppeteer = require("puppeteer");
let page, browser;

beforeEach(async () => {
  browser = await puppeteer.launch({});
  page = await browser.newPage();
  await page.goto("http://localhost:3000");
});
afterEach(async () => {
  await browser.close;
});

test("the header has the correct text", async () => {
  const text = await page.$eval(".brand-logo", el => el.innerHTML);
  expect(text).toEqual("Blogster");
});

test("clicking login redirects to oauth", async () => {
  const text = await page.$eval(".right>li>a", e => e.innerHTML);
  expect(text).toBe("Login With Google");
  await page.click(".right>li>a");
  expect(page.url()).toContain("accounts.google.com");
});
