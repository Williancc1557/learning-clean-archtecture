import type { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository";
import type { AccountModel } from "../add-account/db-add-account-protocols";
import { DbAuthentication } from "./db-authentication";

describe("DbAuthentication UseCase", () => {
  test("should call LoadAccountByEmailRepository with correct Email", () => {
    class LoadAccountByEmailRepositorySpy
      implements LoadAccountByEmailRepository
    {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      public async load(email: string): Promise<AccountModel> {
        return {
          email: "any_email@mail.com",
          id: "any_id",
          name: "any_name",
          password: "any_password",
        };
      }
    }

    const loadAccountByEmailRepositorySpy =
      new LoadAccountByEmailRepositorySpy();

    const sut = new DbAuthentication(loadAccountByEmailRepositorySpy);
    const loadSpy = jest.spyOn(loadAccountByEmailRepositorySpy, "load");

    sut.auth({
      email: "any_email@email.com",
      password: "any_password",
    });

    expect(loadSpy).toHaveBeenCalledWith("any_email@email.com");
  });
});
