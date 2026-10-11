import { test } from "../../fixtures";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000";

test.use({ baseURL: API_BASE_URL });

test.describe("Items API", () => {
  test.beforeAll(async () => {
    const res = await fetch(`${API_BASE_URL}/health`).catch(() => undefined);
    test.skip(!res?.ok, `test-api is not reachable at ${API_BASE_URL}`);
  });

  test("Items_001_Health check", async ({ itemsApi }) => {
    const res = await test.step("STEP 01: GET /health", () => itemsApi.health());
    await test.step("STEP 02: Status is 200 and body is ok", async () => {
      itemsApi.verifyStatus(res, 200);
      itemsApi.verifyBodyContains(res, { status: "ok" });
    });
  });

  test("Items_002_List items contains the seeded item", async ({ itemsApi }) => {
    const res = await test.step("STEP 01: GET /items", () => itemsApi.list());
    await test.step("STEP 02: Status is 200 and list has the seeded item", async () => {
      itemsApi.verifyStatus(res, 200);
      itemsApi.verifyListContains(res, { id: 1, name: "first item" });
    });
  });

  test("Items_003_Create, get and delete an item", async ({ itemsApi }) => {
    const name = `item ${Date.now()}`;
    const created = await test.step("STEP 01: POST /items with a name", () =>
      itemsApi.create({ name }));
    await test.step("STEP 02: Status is 201 and item has the name", async () => {
      itemsApi.verifyStatus(created, 201);
      itemsApi.verifyBodyContains(created, { name });
    });
    const id = created.body?.id ?? 0;
    const fetched = await test.step("STEP 03: GET /items/:id", () => itemsApi.get(id));
    await test.step("STEP 04: Status is 200 and the same item is returned", async () => {
      itemsApi.verifyStatus(fetched, 200);
      itemsApi.verifyBodyContains(fetched, { id, name });
    });
    const removed = await test.step("STEP 05: DELETE /items/:id (cleanup)", () =>
      itemsApi.remove(id));
    await test.step("STEP 06: Status is 204", async () => {
      itemsApi.verifyStatus(removed, 204);
    });
  });

  test("Items_004_Deleted item is gone", async ({ itemsApi }) => {
    const created = await test.step("STEP 01: Create an item", () =>
      itemsApi.create({ name: `to delete ${Date.now()}` }));
    const id = created.body?.id ?? 0;
    await test.step("STEP 02: Delete it", async () => {
      itemsApi.verifyStatus(await itemsApi.remove(id), 204);
    });
    await test.step("STEP 03: GET /items/:id returns 404", async () => {
      itemsApi.verifyStatus(await itemsApi.get(id), 404);
    });
    await test.step("STEP 04: It is no longer in the list", async () => {
      itemsApi.verifyListNotContainsId(await itemsApi.list(), id);
    });
  });

  test("Items_005_Create without name is rejected", async ({ itemsApi }) => {
    const res = await test.step("STEP 01: POST /items with an empty body", () =>
      itemsApi.create({}));
    await test.step("STEP 02: Status is 400 with an error message", async () => {
      itemsApi.verifyStatus(res, 400);
      itemsApi.verifyBodyContains(res, { error: "name is required" });
    });
  });

  test("Items_006_Create with a blank name is rejected", async ({ itemsApi }) => {
    const res = await test.step("STEP 01: POST /items with a blank name", () =>
      itemsApi.create({ name: "   " }));
    await test.step("STEP 02: Status is 400", async () => {
      itemsApi.verifyStatus(res, 400);
    });
  });

  test("Items_007_Unknown item returns 404", async ({ itemsApi }) => {
    await test.step("STEP 01: GET /items/999999 returns 404", async () => {
      const res = await itemsApi.get(999999);
      itemsApi.verifyStatus(res, 404);
      itemsApi.verifyBodyContains(res, { error: "Item not found" });
    });
    await test.step("STEP 02: DELETE /items/999999 returns 404", async () => {
      itemsApi.verifyStatus(await itemsApi.remove(999999), 404);
    });
  });
});
