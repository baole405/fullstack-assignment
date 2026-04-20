import request from "supertest";
import { describe, expect, it } from "vitest";
import { createServer } from "../../server";

describe("Auth routes", () => {
  it("GET /auth/me returns 401 when Authorization header is missing", async () => {
    const app = createServer();

    const response = await request(app).get("/auth/me");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Missing authorization header" });
  });
});
