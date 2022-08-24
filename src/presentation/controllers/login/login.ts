import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import type { Controller, HttpRequest, HttpResponse } from "../../protocols";
import type { EmailValidator } from "../signup/signup-protocols";

export class LoginController implements Controller {
    public constructor(
        private readonly emailValidator: EmailValidator
    ) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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
    }
}