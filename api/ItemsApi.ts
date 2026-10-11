import { APIRequestContext, APIResponse, expect } from "@playwright/test";

export interface Item {
  id: number;
  name: string;
}

export interface ApiResult<T = unknown> {
  status: number;
  body: T | undefined;
}

/** Client for the test-api /items endpoints. Tests call this class, never raw URLs. */
export class ItemsApi {
  constructor(private readonly request: APIRequestContext) {}

  health(): Promise<ApiResult<{ status: string }>> {
    return this.toResult(this.request.get("/health"));
  }

  list(): Promise<ApiResult<Item[]>> {
    return this.toResult(this.request.get("/items"));
  }

  get(id: number): Promise<ApiResult<Item>> {
    return this.toResult(this.request.get(`/items/${id}`));
  }

  create(data: { name?: unknown }): Promise<ApiResult<Item>> {
    return this.toResult(this.request.post("/items", { data }));
  }

  remove(id: number): Promise<ApiResult> {
    return this.toResult(this.request.delete(`/items/${id}`));
  }

  // Soft verifications: the test continues after a failed check (cleanup steps still run).
  verifyStatus(result: ApiResult, expected: number): void {
    expect.soft(result.status, "HTTP status").toBe(expected);
  }

  verifyBodyContains(result: ApiResult, expected: Record<string, unknown>): void {
    expect.soft(result.body, "response body").toMatchObject(expected);
  }

  verifyListContains(result: ApiResult<Item[]>, expected: Partial<Item>): void {
    expect.soft(result.body, "items list").toEqual(
      expect.arrayContaining([expect.objectContaining(expected)]),
    );
  }

  verifyListNotContainsId(result: ApiResult<Item[]>, id: number): void {
    expect.soft((result.body ?? []).map((i) => i.id), "item ids").not.toContain(id);
  }

  private async toResult<T>(pending: Promise<APIResponse>): Promise<ApiResult<T>> {
    const res = await pending;
    const text = await res.text();
    return { status: res.status(), body: text ? (JSON.parse(text) as T) : undefined };
  }
}
