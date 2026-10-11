import { Page } from "@playwright/test";

export const ZnewsLocators = {
  // The top menu renders as either nav.category-menu or ul.normal-category
  // depending on the header variant; getByRole only matches the visible one.
  congNgheTab: (page: Page) =>
    page
      .locator("nav.category-menu, ul.normal-category")
      .getByRole("link", { name: "Công nghệ" }),

  congNgheHeading: (page: Page) =>
    page.getByRole("heading", { level: 1, name: "Công nghệ" }),

};
