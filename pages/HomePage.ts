import { Page, expect } from "@playwright/test";
import { HomeLocators } from "../locators/HomeLocators";

export class HomePage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/");
  }

  async clickGetStarted(): Promise<void> {
    await HomeLocators.getStartedLink(this.page).click();
  }

  async verifyHeadingContains(text: string): Promise<void> {
    await expect.soft(HomeLocators.heading(this.page)).toContainText(text);
  }
}
