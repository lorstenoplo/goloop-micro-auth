import { VercelRequest, VercelResponse } from "@vercel/node";
import { RegisterInput } from "types/register-input-type";

export default async function register(
  req: VercelRequest,
  res: VercelResponse
) {
  const { username, email, password }: RegisterInput = req.body;
  res.status(200).send(`username: ${username}`);
}
