import type { Collection, Document, WithId } from "mongodb";
import { ObjectId } from "mongodb";
import type { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import type { AccountModel } from "../../../../domain/models/account";
import type { AddAccountModel } from "../../../../domain/usecases/add-account";
import { mongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {
  public async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = mongoHelper.getCollection("accounts");
    const objectId = (await accountCollection.insertOne(accountData))
      .insertedId;

    return this.renameIdKey(
      await this.getUserByObjectId(accountCollection, objectId)
    );
  }

  private renameIdKey(account: WithId<Document>): AccountModel {
    const { _id, ...accountWithoudId } = account;

    return {
      ...accountWithoudId,
      id: _id.toString(),
    } as AccountModel;
  }

  private getUserByObjectId(
    accountCollection: Collection,
    objectId: ObjectId
  ): Promise<WithId<Document>> {
    return accountCollection.findOne(new ObjectId(objectId));
  }
}