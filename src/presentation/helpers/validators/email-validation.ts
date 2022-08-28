import { InvalidParamError } from "../../errors";
import type { EmailValidator } from "../../protocols/email-validator";
import type { Validation } from "./validation";

export class EmailValidation implements Validation {
  public constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public validate(input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName]);
    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
