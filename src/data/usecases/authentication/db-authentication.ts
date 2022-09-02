import type {
  Authentication,
  AuthenticationModel,
} from "../../../domain/usecases/authentication";
import type { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository";

export class DbAuthentication implements Authentication {
  public constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  public async auth(authentication: AuthenticationModel): Promise<string> {
    this.loadAccountByEmailRepository.load(authentication.email);

    return null;
  }
}
