import app from "../config/app";
import request from "supertest";

/* eslint-disable jest/expect-expect*/

describe("Content type Middleware", () => {
  test("should return default content type as json", async () => {
    app.get("/test_content_type", (req, res) => {
      res.send("");
    });

    const req = await request(app).get("/test_content_type");

    expect(req.header["content-type"]).toBe("application/json; charset=utf-8");
  });

  test("should return xml content type when forced", async () => {
    app.get("/test_content_type_xml", (req, res) => {
      res.type("xml");
      res.send("");
    });

    const req = await request(app).get("/test_content_type_xml");

    expect(req.header["content-type"]).toBe("application/xml; charset=utf-8");
  });
});
