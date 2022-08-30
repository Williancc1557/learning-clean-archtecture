import { MissingParamError } from "../../errors";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../helpers/http-helper";
import type { Validation } from "../../protocols/validation";
import { LoginController } from "./login";
import type {
  EmailValidator,
  HttpRequest,
  Authentication,
} from "./login-protocols";

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
  validationStub: Validation;
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();
  const validationStub = makeValidation();
  const sut = new LoginController(
    emailValidatorStub,
    authenticationStub,
    validationStub
  );

  return {
    sut,
    emailValidatorStub,
    authenticationStub,
    validationStub,
  };
};

describe("Login Controller", () => {
  test("should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");
    await sut.handle(makeFakeRequest());

    expect(authSpy).toHaveBeenCalledWith("any_email", "any_password");
  });

  test("should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, "auth").mockResolvedValue(null);
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toStrictEqual(unauthorized());
  });

  test("should return 500 if Authentication.auth throws", async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, "auth").mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toStrictEqual(serverError());
  });

  test("should return 200 if valid credentials are provided", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toStrictEqual(
      ok({
        accessToken: "any_token",
      })
    );
  });

  test("should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("should return 400 if Validation returns an error", async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"));
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toStrictEqual(
      badRequest(new MissingParamError("any_field"))
    );
  });
});
