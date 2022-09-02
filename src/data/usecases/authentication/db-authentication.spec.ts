import type { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository";
import type { AccountModel } from "../add-account/db-add-account-protocols";
import { DbAuthentication } from "./db-authentication";

const makeFakeAccount = (): AccountModel => ({
  email: "any_email@mail.com",
  id: "any_id",
  name: "any_name",
  password: "any_password",
});

const makeLoadAccountByEmailRepository = () => {
  class LoadAccountByEmailRepositorySpy
    implements LoadAccountByEmailRepository
  {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async load(email: string): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }

  return new LoadAccountByEmailRepositorySpy();
};

const makeSut = () => {
  const loadAccountByEmailRepositorySpy = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(loadAccountByEmailRepositorySpy);

  return {
    sut,
    loadAccountByEmailRepositorySpy,
  };
};

describe("DbAuthentication UseCase", () => {
  test("should call LoadAccountByEmailRepository with correct Email", async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositorySpy, "load");

    await sut.auth({
      email: "any_email@email.com",
      password: "any_password",
    });

    expect(loadSpy).toHaveBeenCalledWith("any_email@email.com");
  });

  test("should throw if LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositorySpy, "load")
      .mockRejectedValueOnce(new Error());

    const promise = sut.auth({
      email: "any_email@email.com",
      password: "any_password",
    });

    await expect(promise).rejects.toThrow();
  });
});
