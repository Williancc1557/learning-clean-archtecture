import type {
  HttpResponse,
  HttpRequest,
  Controller,
  AddAccount,
  Validation,
} from "./signup-protocols";
import { badRequest, serverError, ok } from "../../helpers/http-helper";
export class SignUpController implements Controller {
  public constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { email, password, name } = httpRequest.body;
      const account = await this.addAccount.add({
        email,
        password,
        name,
      });

      return ok(account);
    } catch (error) {
      return serverError();
    }
  }
}
