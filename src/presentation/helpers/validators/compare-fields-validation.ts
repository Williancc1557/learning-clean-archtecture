import { InvalidParamError } from "../../errors";
import type { Validation } from "./validation";

export class CompareFieldsValidation implements Validation {
  public constructor(
    private readonly fieldName: string,
    private readonly fieldToCompareName: string
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public validate(input: any): Error {
    if (input[this.fieldName] != input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName);
    }
  }
}
