import { envConfig } from "../../config/env-config";
import * as bcrypt from "bcrypt";

export class PasswordUtils {
  private static readonly SALT_ROUNDS = envConfig.DEFAULT_SALT_HASH_ITERATIONS;

  static async hashPassword(
    password: string,
    salt?: string | number,
  ): Promise<string> {
    const actualSalt = salt ?? (await bcrypt.genSalt(this.SALT_ROUNDS));
    return await bcrypt.hash(password, actualSalt);
  }

  static async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
