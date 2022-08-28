import { InvalidParamError } from "../../errors";
import type { EmailValidator } from "../../protocols/email-validator";
import { EmailValidation } from "./email-validation";

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeSut = () => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new EmailValidation("email", emailValidatorStub);

  return {
    sut,
    emailValidatorStub,
  };
};

describe("Email Validation", () => {
  test("should return error if email is not valid", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const response = sut.validate({ email: "any_email@mail.com" });

    expect(response).toStrictEqual(new InvalidParamError("email"));
  });

  test("should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    sut.validate({ email: "any_email@mail.com" });

    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  test("should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });
});
