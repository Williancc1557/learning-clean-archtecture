import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
    async hash(): Promise<string> {
        return "hashed_value";
    },
}));

const SALT = 12;

const makeSut = (): BcryptAdapter => {
    return new BcryptAdapter(SALT);
};

describe("Bcrypt Adapter", () => {
    test("should call bcrypt with corret value", async () => {
        const sut = makeSut();

        const hashSpy = jest.spyOn(bcrypt, "hash");
        await sut.encrypt("any_value");

        expect(hashSpy).toHaveBeenCalledWith("any_value", SALT);
    });

    test("should return a hash on sucess", async () => {
        const sut = makeSut();
        const hash = await sut.encrypt("any_value");

        expect(hash).toBe("hashed_value");
    });
});