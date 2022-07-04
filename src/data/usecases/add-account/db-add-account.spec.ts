import { DbAddAccount } from "./db-add-account";

describe("DbAddAccount Usecase", () => {
    test("should call Encrypter with correct password", async () => {
        class EncrypterStub {
            public async encrypt(value: string): Promise<string> { // eslint-disable-line
                return "rashed_password";
            }
        }

        const encrypterStub = new EncrypterStub();
        const sut = new DbAddAccount(encrypterStub);
        const encryptSpy = jest.spyOn(encrypterStub, "encrypt");

        const accountData = {
            name: "valid_name",
            email: "valid_email@email.com",
            password: "valid_password",
        };
        sut.add(accountData);

        expect(encryptSpy).toHaveBeenCalledWith("valid_password");
    });
});