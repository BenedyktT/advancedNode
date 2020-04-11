const Page = require("../helpers/page");
const close = require("../setup");
let page;
beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});
afterAll(async () => {
  await close();
});

jest.setTimeout(30000);

describe("integration test of blog components when logged in", () => {
  beforeEach(async () => {
    await page.login();
    await page.click(".right>li>a");
    await page.click("a[href='/blogs/new']");
  });

  test("should redirect to blogs after clicking nav element", async () => {
    await page.click(".right>li>a");
    expect(page.url()).toContain("/blogs");
  });

  test("should show button to add new blog", async () => {
    expect(page.url()).toContain("/blogs/new");
  });

  test("should show create new blog form", async () => {
    const title = await page.text("form>.title>label");
    expect(title).toBe("Blog Title");
    const content = await page.text("form>.content>label");
    expect(content).toBe("Content");
    const next = await page.text("form>button");
    expect(next).toContain("Next");
    const cancel = await page.text("form>a.red");
    expect(cancel).toBe("Cancel");
  });
  describe("And using invalid inputs", () => {
    beforeEach(async () => {
      await page.click("form>button");
    });
    test("should show error message", async () => {
      const title = await page.text(".title>.red-text");
      expect(title).toBe("You must provide a value");
      const content = await page.text(".content>.red-text");
      expect(content).toBe("You must provide a value");
    });
  });
  describe("And using valid inputs", () => {
    beforeEach(async () => {
      await page.type(".title>input", "My Title");
      await page.type(".content>input", "My content");
      await page.click("form>button");
    });
    test("Submitting takes user to review screen", async () => {
      const text = await page.text("h5");
      expect(text).toEqual("Please confirm your entries");
    });
    test("Submitting  then saving adds blog to index page", async () => {
      await page.click("button.green");
      await page.waitFor(".card");
      const title = await page.text(".card-title");
      const content = await page.text("p");
      expect(title).toEqual("My Title");
      expect(content).toEqual("My content");
    });
  });
});

describe("integration test of blog component when NOT logged in", () => {
  const actions = [
    {
      method: "get",
      url: "/api/blogs",
      comment: "User cannot create blog post",
    },
    {
      method: "post",
      url: "/api/blogs",
      comment: "User cannot list blogs when not logged in",
      data: {
        title: "T",
        content: "C",
      },
    },
  ];

  test("interaction with blogs while not logged in", async () => {
    const results = await page.execRequests(actions);
    results.forEach((e) => expect(e.error).toEqual("You must log in!"));
  });
});
