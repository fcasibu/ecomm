import { hash, compare } from "bcryptjs";

export async function hashPassword(password: string, salt = 10) {
  return await hash(password, salt);
}

export async function comparePassword(password: string, hash: string) {
  return await compare(password, hash);
}
