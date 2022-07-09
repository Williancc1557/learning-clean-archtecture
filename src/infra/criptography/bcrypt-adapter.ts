import type { Encrypter } from "../../data/protocols/encrypter";
import bcrypt from "bcrypt";


export class BcryptAdapter implements Encrypter{

    public constructor(
        private readonly salts: number
    ) {}

    public async encrypt(value: string): Promise<string> {
        const hash = await bcrypt.hash(value, this.salts);

        return hash;
    }
}