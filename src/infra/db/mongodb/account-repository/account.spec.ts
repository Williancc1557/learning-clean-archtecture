import { mongoHelper } from "../helpers/mongo-helper";
import { AccountMongoRepository } from "./account";

const makeSut = () => {
  const sut = new AccountMongoRepository();

  return {
    sut,
  };
};

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await mongoHelper.connect();
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCOllection = await mongoHelper.getCollection("accounts");
    await accountCOllection.deleteMany({});
  });

  test("should return an account on sucess", async () => {
    const { sut } = makeSut();

    const account = await sut.add({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("any_name");
    expect(account.email).toBe("any_email@mail.com");
    expect(account.password).toBe("any_password");
  });
});
