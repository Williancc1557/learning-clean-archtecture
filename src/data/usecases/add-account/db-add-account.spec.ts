import { DbAddAccount } from "./db-add-account";
import type { AccountModel, Encrypter, AddAccountRepository, AddAccountModel } from "./db-add-account-protocols";


const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        public async encrypt(value: string): Promise<string> { // eslint-disable-line
            return "hashed_password";
        }
    }

    return new EncrypterStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        public async add(accountData: AddAccountModel): Promise<AccountModel> { // eslint-disable-line
            const fakeAccount = {
                id: "valid_id",
                name: "valid_name",
                email: "valid_email@email.com",
                password: "valid_password",
            };

            return fakeAccount;
        }
    }

    return new AddAccountRepositoryStub();
};

interface SutTypes {
    sut: DbAddAccount;
    encrypterStub: Encrypter;
    addAccountRepositoryStub: AddAccountRepository;

}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter();
    const addAccountRepositoryStub = makeAddAccountRepository();
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

    return {
        encrypterStub,
        addAccountRepositoryStub,
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
        await sut.add(accountData);

        expect(encryptSpy).toHaveBeenCalledWith("valid_password");
    });

    test("should throw if Encrypter throws", async () => {
        const { encrypterStub, sut } = makeSut();

        jest.spyOn(encrypterStub, "encrypt").mockRejectedValueOnce(new Error());

        const accountData = {
            name: "valid_name",
            email: "valid_email@email.com",
            password: "valid_password",
        };

        const promise = sut.add(accountData);

        await expect(promise).rejects.toThrow();
    });

    test("should call AddAccountRepository with correct password", async () => {
        const { addAccountRepositoryStub, sut } = makeSut();
        const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
        const accountData = {
            name: "valid_name",
            email: "valid_email@email.com",
            password: "valid_password",
        };
        await sut.add(accountData);

        expect(addSpy).toHaveBeenCalledWith({
            name: "valid_name",
            email: "valid_email@email.com",
            password: "hashed_password",
        });
    });

    test("should return an account on sucess", async () => {
        const { sut } = makeSut();

        const accountData = {
            name: "valid_name",
            email: "valid_email@email.com",
            password: "valid_password",
        };
        const account = await sut.add(accountData);

        expect(account).toStrictEqual({
            id: "valid_id",
            name: "valid_name",
            email: "valid_email@email.com",
            password: "valid_password",
        });
    });
});