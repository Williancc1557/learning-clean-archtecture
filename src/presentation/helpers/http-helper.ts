import type { HttpResponse } from "../protocols/http";
import { ServerError, UnauthorizedError } from "../errors";

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: { error: error.message },
});

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: { error: new ServerError().message },
});

// eslint-disable-next-line
export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: { error: new UnauthorizedError().message },
});
