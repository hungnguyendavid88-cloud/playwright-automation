import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ZnewsPage } from "../pages/ZnewsPage";

export const test = base.extend<{ homePage: HomePage; znewsPage: ZnewsPage }>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  znewsPage: async ({ page }, use) => {
    await use(new ZnewsPage(page));
  },
});

export { expect } from "@playwright/test";
