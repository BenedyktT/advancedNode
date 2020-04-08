const Page = require("../helpers/page");
let page;
describe("header", () => {
  beforeEach(async () => {
    page = await Page.build();
    return await page.goto("http://localhost:3000");
  });
  afterEach(async () => {
    await page.close();
  });

  test("the header has the correct text", async () => {
    const text = await page.text(".brand-logo");
    expect(text).toEqual("Blogster");
  });

  test("clicking login redirects to oauth", async () => {
    const text = await page.text(".right>li>a");
    expect(text).toBe("Login With Google");
    await page.click(".right>li>a");
    expect(page.url()).toContain("accounts.google.com");
  });

  test("should show logout when signed in", async () => {
    await page.login();
    const text = await page.text("a[href='/auth/logout']");
    expect(text).toEqual("Logout");
  });
});
