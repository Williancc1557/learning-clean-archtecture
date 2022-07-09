import type { Encrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

interface SutTypes {
    sut: DbAddAccount;
    encrypterStub: Encrypter;
}

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        public async encrypt(value: string): Promise<string> { // eslint-disable-line
            throw new Error();
        }
    }

    return new EncrypterStub();
};

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter();
    const sut = new DbAddAccount(encrypterStub);

    return {
        encrypterStub,
        sut,
    };
};

describe("DbAddAccount Usecase", () => {
    test("should call Encrypter with correct password", async () => {
        const { encrypterStub, sut } = makeSut();

        const encryptSpy = jest.spyOn(encrypterStub, "encrypt");

        const accountData = {
            name: "valid_name",
            email: "valid_email@email.com",
            password: "valid_password",
        };
        sut.add(accountData);

        expect(encryptSpy).toHaveBeenCalledWith("valid_password");
    });

    test("should throw if Encrypter throws", async () => {
        const { encrypterStub, sut } = makeSut();

        jest.spyOn(encrypterStub, "encrypt").mockImplementation(() => {
            throw new Error();
        });

        const accountData = {
            name: "valid_name",
            email: "valid_email@email.com",
            password: "valid_password",
        };

        const promise = sut.add(accountData);

        await expect(promise).rejects.toThrow();
    });
});