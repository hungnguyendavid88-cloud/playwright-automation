import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ZnewsPage } from "../pages/ZnewsPage";
import { ItemsApi } from "../api/ItemsApi";

export const test = base.extend<{
  homePage: HomePage;
  znewsPage: ZnewsPage;
  itemsApi: ItemsApi;
}>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  znewsPage: async ({ page }, use) => {
    await use(new ZnewsPage(page));
  },
  itemsApi: async ({ request }, use) => {
    await use(new ItemsApi(request));
  },
});

export { expect } from "@playwright/test";
