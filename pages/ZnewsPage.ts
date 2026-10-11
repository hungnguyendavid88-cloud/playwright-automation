import { Page, expect } from "@playwright/test";
import { ZnewsLocators } from "../locators/ZnewsLocators";

const ZNEWS_URL = "https://znews.vn/";

export class ZnewsPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto(ZNEWS_URL);
  }

  async clickCongNgheTab(): Promise<void> {
    await ZnewsLocators.congNgheTab(this.page).click();
  }

  async verifyCongNghePageOpened(): Promise<void> {
    await expect.soft(this.page).toHaveURL(/tech\.zingnews\.vn\/cong-nghe\.html/);
  }

  async verifyCongNgheScreenshot(): Promise<void> {
    const heading = ZnewsLocators.congNgheHeading(this.page);
    await expect(heading).toBeVisible();
    const box = await heading.boundingBox();
    if (!box) throw new Error("Công nghệ heading has no bounding box");
    // Fixed-size clip around the centred title text: the heading block's own width
    // differs by 1px between headed and headless runs, which fails the size check.
    const clipWidth = 400;
    await expect.soft(this.page).toHaveScreenshot("cong-nghe-page.png", {
      clip: {
        x: Math.round(box.x + box.width / 2 - clipWidth / 2),
        y: Math.round(box.y),
        width: clipWidth,
        height: Math.round(box.height),
      },
      animations: "disabled",
      maxDiffPixelRatio: 0.01,
    });
  }
}
