const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");
class CustomPage {
  static async build(isHeadless = true) {
    const browser = await puppeteer.launch({
      headless: isHeadless,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    const customPage = new CustomPage(page);
    return new Proxy(customPage, {
      get: function (target, property) {
        return target[property] || browser[property] || page[property];
      },
    });
  }
  constructor(page) {
    this.page = page;
  }
  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    await this.page.setCookie({ name: "session", value: session });
    await this.page.setCookie({ name: "session.sig", value: sig });
    await this.page.goto("http://localhost:3000/blogs");
    await this.page.waitFor("a[href='/auth/logout']");
  }
  text(selector) {
    return this.page.$eval(selector, (el) => el.innerHTML);
  }
  get(url) {
    return this.page.evaluate((_url) => {
      return fetch(_url, {
        method: "GET",
        credentials: "same-origin",
      }).then((res) => res.json());
    }, url);
  }
  post(url, data) {
    return this.page.evaluate(
      (_url, _data) => {
        return fetch(_url, {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(_data),
        }).then((res) => res.json());
      },
      url,
      data
    );
  }
  execRequests(actions) {
    return Promise.all(
      actions.map(({ method, url, data }) => {
        return this[method](url, data);
      })
    );
  }
}
module.exports = CustomPage;
