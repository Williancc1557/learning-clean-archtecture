import type {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../presentation/protocols";
import { LogControllerDecorator } from "./log";

/* eslint-disable @typescript-eslint/no-unused-vars */
describe("LogController Decorator", () => {
  test("should call controller handle", async () => {
    class ControllerStub implements Controller {
      public handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: {
            id: "any_id",
            email: "any_mail@mail.com",
            name: "any_name",
            password: "123",
            passwordConfirmation: "123",
          },
        };

        return new Promise((resolve) => resolve(httpResponse));
      }
    }

    const controllerStub = new ControllerStub();
    const controllerStubSpy = jest.spyOn(controllerStub, "handle");
    const sut = new LogControllerDecorator(controllerStub);

    const httpRequest: HttpRequest = {
      body: {
        email: "any_mail@mail.com",
        name: "any_name",
        password: "123",
        passwordConfirmation: "123",
      },
    };
    await sut.handle(httpRequest);

    expect(controllerStubSpy).toBeCalledWith({
      body: {
        email: "any_mail@mail.com",
        name: "any_name",
        password: "123",
        passwordConfirmation: "123",
      },
    });
  });
});
