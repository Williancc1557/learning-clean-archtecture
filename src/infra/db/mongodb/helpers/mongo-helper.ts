import type { Collection } from "mongodb";
import { MongoClient } from "mongodb";

export const mongoHelper = {
  client: null as MongoClient,
  async connect(url?: string): Promise<void> {
    this.client = await new MongoClient(url || process.env.MONGO_URL).connect();
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },

  // eslint-disable-next-line
  map(account: any): any {
    const { _id, ...accountWithoudId } = account;

    return {
      ...accountWithoudId,
      id: _id.toString(),
    };
  },
};
