import { InvalidParamError, MissingParamError } from "../../errors";
import {
  badRequest,
  serverError,
  unauthorized,
} from "../../helpers/http-helper";
import type {
  Controller,
  Authentication,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from "./login-protocols";

export class LoginController implements Controller {
  public constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;
      if (!email) {
        return badRequest(new MissingParamError("email"));
      }

      if (!password) {
        return badRequest(new MissingParamError("password"));
      }

      if (!this.emailValidator.isValid(httpRequest.body.email)) {
        return badRequest(new InvalidParamError("email"));
      }

      const auth = await this.authentication.auth(email, password);

      if (!auth) {
        return unauthorized();
      }
    } catch (err) {
      return serverError();
    }
  }
}
