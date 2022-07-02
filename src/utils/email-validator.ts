import type { EmailValidator } from "../presentation/protocols/email-validator";
import validator from "validator";

export class EmailValidatorAdapter implements EmailValidator {
    public isValid(email: string): boolean {  // eslint-disable-line
        return validator.isEmail(email);
    }
}