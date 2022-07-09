import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

describe("Bcrypt Adapter", () => {
    test("should call bcrypt with corret value", async () => {
        const SALT = 12;
        const sut = new BcryptAdapter(SALT);

        const hashSpy = jest.spyOn(bcrypt, "hash");
        await sut.encrypt("any_value");

        expect(hashSpy).toHaveBeenCalledWith("any_value", SALT);
    });
});