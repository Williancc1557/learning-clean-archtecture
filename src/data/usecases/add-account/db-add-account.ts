import type { AccountModel, AddAccount, AddAccountModel, Encrypter } from "./db-add-account-protocols";
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