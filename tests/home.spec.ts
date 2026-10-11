import { test } from "../fixtures";

test("Home_001_Open home page", async ({ homePage }) => {
  await test.step("STEP 01: Open the home page", async () => {
    await homePage.open();
  });
  await test.step("STEP 02: Heading is displayed", async () => {
    await homePage.verifyHeadingContains("Playwright");
  });
});
