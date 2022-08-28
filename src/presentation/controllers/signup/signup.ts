import type {
  HttpResponse,
  HttpRequest,
  Controller,
  EmailValidator,
  AddAccount,
  Validation,
} from "./signup-protocols";
import { InvalidParamError } from "../../errors";
import { badRequest, serverError, ok } from "../../helpers/http-helper";
export class SignUpController implements Controller {
  public constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const data = {
        ...httpRequest.body,
      };

      if (!this.emailValidator.isValid(data.email)) {
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
}
