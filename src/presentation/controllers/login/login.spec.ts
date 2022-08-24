import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
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

const makeFakeRequest = (): HttpRequest => ({
    body: {
        email: "any_email",
        password: "any_password",
    },
});

interface SutTypes {
    sut: LoginController;
    emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator();
    const sut = new LoginController(emailValidatorStub);

    return {
        sut,
        emailValidatorStub,
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

        expect(httpResponse).toStrictEqual(badRequest(new MissingParamError("email")));
    });

    test("should return 400 if no password is provided", async () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                email: "any_password",
            },
        };

        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse).toStrictEqual(badRequest(new MissingParamError("password")));
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

        expect(httpResponse).toStrictEqual(badRequest(new InvalidParamError("email")));
    });
});