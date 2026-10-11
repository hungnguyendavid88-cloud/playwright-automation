import { Page } from "@playwright/test";

export const HomeLocators = {
  getStartedLink: (page: Page) => page.getByRole("link", { name: "Get started" }),
  heading: (page: Page) => page.getByRole("heading", { level: 1 }),
};
