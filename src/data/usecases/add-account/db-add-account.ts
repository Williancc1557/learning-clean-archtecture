import type { AccountModel } from "../../../domain/models/account";
import type { AddAccount, AddAccountModel } from "../../../domain/usecases/add-account";
import type { Encrypter } from "../../protocols/encrypter";

export class DbAddAccount implements AddAccount{
   public constructor(
    private readonly encrypter: Encrypter
   ) {}

    public async add(account: AddAccountModel): Promise<AccountModel> {
        this.encrypter.encrypt(account.password).catch((err) => {
            console.error(err);
        });

        return null;
    }
}