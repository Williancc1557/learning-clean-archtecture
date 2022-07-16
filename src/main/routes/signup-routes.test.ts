import app from "../config/app";
import request from "supertest";

describe("SignUp routes", () => {
  test("should return an account on sucess", async () => {
    const req = await request(app).post("/api/signup").send({
      name: "Willian",
      email: "willian.cavalcanti@gmai.com",
      password: "123",
      passwordConfirmation: "123",
    });

    expect(req.statusCode).toBe(200);
  });
});
