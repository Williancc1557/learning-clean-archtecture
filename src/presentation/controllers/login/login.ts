import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../helpers/http-helper";
import type { Validation } from "../../protocols/validation";
import type {
  Controller,
  Authentication,
  HttpRequest,
  HttpResponse,
} from "./login-protocols";

export class LoginController implements Controller {
  public constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { email, password } = httpRequest.body;
      const auth = await this.authentication.auth({ email, password });

      if (!auth) {
        return unauthorized();
      }

      return ok({
        accessToken: auth,
      });
    } catch (err) {
      return serverError();
    }
  }
}
