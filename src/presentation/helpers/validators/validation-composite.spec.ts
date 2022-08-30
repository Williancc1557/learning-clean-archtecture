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
  const validationStubs = [makeValidation(), makeValidation()];
  const sut = new ValidationComposite(validationStubs);

  return { sut, validationStubs };
};

describe("Validation Composite", () => {
  test("should return an error if any validation fails", () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[0], "validate")
      .mockReturnValueOnce(new MissingParamError("field"));
    const error = sut.validate({ field: "any_value" });

    expect(error).toStrictEqual(new MissingParamError("field"));
  });

  test("should return the first error if more then one validation fails", () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], "validate").mockReturnValueOnce(new Error());
    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValueOnce(new MissingParamError("field"));
    const error = sut.validate({ field: "any_value" });

    expect(error).toStrictEqual(new Error());
  });
});
