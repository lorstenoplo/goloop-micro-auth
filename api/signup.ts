import { VercelRequest, VercelResponse } from "@vercel/node";
import { RegisterInput } from "../types/register-input-type";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";

export default async function register(
  req: VercelRequest,
  res: VercelResponse
) {
  const { username, email, password }: RegisterInput = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user: RegisterInput = { username, email, password: hashedPassword };
  const token = generateToken(user);
  res
    .status(200)
    .send(
      `a user with username: ${username} and token : ${token} has been created`
    );
}
