import { VercelRequest, VercelResponse } from "@vercel/node";
import { LoginInput } from "../types/login-input-types";
import connectToDatabase from "../utils/connectToDb";
import generateToken from "../utils/generateToken";
import bcrypt from "bcryptjs";

export default async function login(req: VercelRequest, res: VercelResponse) {
  const { emailOrUsername, password }: LoginInput = JSON.parse(req.body);
  const db = await connectToDatabase(process.env.MONGO_CONNECTION_URL);
  const user = await db
    .collection("users")
    .findOne(
      emailOrUsername.includes("@")
        ? { email: emailOrUsername }
        : { username: emailOrUsername }
    );

  if (!user) {
    res.status(500).json({
      errors: [
        {
          field: "emailOrUsername",
          message: "A user with that emailOrUsername does not exist",
        },
      ],
    });
  } else {
    const valid = await bcrypt.compare(password, (user as any).password);

    if (!valid) {
      res.status(500).json({
        errors: [
          {
            field: "password",
            message: "Incorrect password",
          },
        ],
      });
      console.log("incorrect cerds");
    } else {
      const token = generateToken(user);
      res.send({ user, token });
    }
  }
}
