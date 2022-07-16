import type {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../presentation/protocols";

export class LogControllerDecorator implements Controller {
  public constructor(private readonly controller: Controller) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return this.controller.handle(httpRequest);
  }
}
