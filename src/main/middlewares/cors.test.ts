import app from "../config/app";
import request from "supertest";

/* eslint-disable jest/expect-expect*/

describe("Cors Middleware", () => {
  test("should enable cors", async () => {
    app.get("/test_cors", (req, res) => {
      res.send();
    });

    const req = await request(app).get("/test_cors");

    expect(req.header["access-control-allow-origin"]).toBe("*");
    expect(req.header["access-control-allow-headers"]).toBe("*");
    expect(req.header["access-control-allow-methods"]).toBe("*");
  });
});
