import { MissingParamError } from "../../errors";
import type { Validation } from "./validation";
import { ValidationComposite } from "./validation-composite";

const makeValidation = () => {
  class ValidationStub implements Validation {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeSut = () => {
  const validationStub = makeValidation();
  const sut = new ValidationComposite([validationStub]);

  return { sut, validationStub };
};

describe("Validation Composite", () => {
  test("should return an error if any validation fails", () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("field"));
    const error = sut.validate({ field: "any_value" });

    expect(error).toStrictEqual(new MissingParamError("field"));
  });
});
