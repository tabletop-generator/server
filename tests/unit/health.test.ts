import request from "supertest";

// Get our Express app object (we don't need the server part)
import app from "../../src/app";

// Get the version and author from our package.json
import { version } from "../../package.json";

describe("/ health check", () => {
  test("should return HTTP 200 response", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });

  test("should return Cache-Control: no-cache header", async () => {
    const res = await request(app).get("/");
    expect(res.headers["cache-control"]).toStrictEqual("no-cache");
  });

  test("should return status: ok in response", async () => {
    const res = await request(app).get("/");
    expect(res.body.status).toStrictEqual("ok");
  });

  test("should return correct version, githubUrl, and author in response", async () => {
    const res = await request(app).get("/");
    expect(res.body.githubUrl.startsWith("https://github.com/")).toBe(true);
    expect(res.body.version).toStrictEqual(version);
  });
});
