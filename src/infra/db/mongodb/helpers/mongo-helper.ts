import type { Collection } from "mongodb";
import { MongoClient } from "mongodb";

export const mongoHelper = {
  client: null as MongoClient,
  async connect(): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGO_URL);
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },
};