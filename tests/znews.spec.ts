import { test } from "../fixtures";

test("Znews_001_Open Cong nghe tab", async ({ znewsPage }) => {
  await test.step("STEP 01: Go to znews.vn", async () => {
    await znewsPage.open();
  });
  await test.step("STEP 02: Click the Công nghệ tab", async () => {
    await znewsPage.clickCongNgheTab();
  });
  await test.step("STEP 03: Công nghệ page is opened", async () => {
    await znewsPage.verifyCongNghePageOpened();
  });
  await test.step("STEP 04: Screenshot of the Công nghệ page matches the baseline", async () => {
    await znewsPage.verifyCongNgheScreenshot();
  });
});
