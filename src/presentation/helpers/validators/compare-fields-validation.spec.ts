import { InvalidParamError } from "../../errors";
import { CompareFieldsValidation } from "./compare-fields-validation";

const makeSut = () => {
  const sut = new CompareFieldsValidation("field", "fieldToCompare");

  return {
    sut,
  };
};

describe("RequiredField validation", () => {
  test("should return MissingParamError if the field is not provided", () => {
    const { sut } = makeSut();
    const res = sut.validate({
      field: "any_field",
      fieldToCompare: "invalid_field",
    });

    expect(res).toStrictEqual(new InvalidParamError("fieldToCompare"));
  });

  test("should return undefined if validation succeeds", () => {
    const { sut } = makeSut();
    const res = sut.validate({
      field: "any_field",
      fieldToCompare: "any_field",
    });

    expect(res).toBeUndefined();
  });
});
