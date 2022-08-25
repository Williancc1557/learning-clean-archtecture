import type { Authentication } from "../../../domain/usecases/authentication";
import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, serverError } from "../../helpers/http-helper";
import type { EmailValidator, HttpRequest } from "../signup/signup-protocols";
import { LoginController } from "./login";

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async auth(email: string, password: string): Promise<string> {
      return "any_token";
    }
  }

  return new AuthenticationStub();
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any_email",
    password: "any_password",
  },
});

interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();
  const sut = new LoginController(emailValidatorStub, authenticationStub);

  return {
    sut,
    emailValidatorStub,
    authenticationStub,
  };
};

describe("Login Controller", () => {
  test("should return 400 if no email is provided", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        password: "any_password",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toStrictEqual(
      badRequest(new MissingParamError("email"))
    );
  });

  test("should return 400 if no password is provided", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: "any_password",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toStrictEqual(
      badRequest(new MissingParamError("password"))
    );
  });

  test("should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");

    await sut.handle(makeFakeRequest());

    expect(isValidSpy).toHaveBeenCalledWith("any_email");
  });

  test("should return 400 if EmailValidator.isValid returns false", async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toStrictEqual(
      badRequest(new InvalidParamError("email"))
    );
  });

  test("should return 400 if EmailValidator.isValid throws", async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toStrictEqual(serverError());
  });

  test("should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();

    const authSpy = jest.spyOn(authenticationStub, "auth");

    await sut.handle(makeFakeRequest());

    expect(authSpy).toHaveBeenCalledWith("any_email", "any_password");
  });
});
