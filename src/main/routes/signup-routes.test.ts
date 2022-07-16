import app from "../config/app";
import request from "supertest";
import { mongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";

describe("SignUp routes", () => {
  beforeAll(async () => {
    await mongoHelper.connect();
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

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
