import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { LogControllerDecorator } from "../../decorators/log";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import type { Controller } from "../../presentation/protocols";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { makeSignUpValidation } from "./signup-validation";

export const makeSignUpController = (): Controller => {
  const emailVaidatorAdapter = new EmailValidatorAdapter();

  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);

  const accountMongoRepository = new AccountMongoRepository();
  const addAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const signUpController = new SignUpController(
    emailVaidatorAdapter,
    addAccount,
    makeSignUpValidation()
  );
  return new LogControllerDecorator(signUpController);
};
