import type {
  HttpResponse,
  HttpRequest,
  Controller,
  EmailValidator,
  AddAccount,
} from "./signup-protocols";
import { MissingParamError, InvalidParamError } from "../../errors";
import { badRequest, serverError, ok } from "../../helpers/http-helper";
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  private readonly addAccount: AddAccount;

  public constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const missingParam = this.returnBadRequestIfMissingParam(httpRequest);
      if (missingParam) {
        return badRequest(missingParam);
      }
      const data = {
        ...httpRequest.body,
      };

      if (!this.comparePasswordAndPasswordConfirmation(data)) {
        return badRequest(new InvalidParamError("passwordConfirmation"));
      }

      const isValid = this.emailValidator.isValid(data.email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
      const account = await this.addAccount.add({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      return ok(account);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }

  private returnBadRequestIfMissingParam(
    httpRequest: HttpRequest
  ): Error | void {
    const requiredFields = [
      "name",
      "email",
      "password",
      "passwordConfirmation",
    ];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return new MissingParamError(field);
      }
    }
  }

  // eslint-disable-next-line
  private comparePasswordAndPasswordConfirmation(data: any): boolean {
    if (data.password !== data.passwordConfirmation) {
      return false;
    }
    return true;
  }
}
