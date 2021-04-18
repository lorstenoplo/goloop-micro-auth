import { VercelRequest, VercelResponse } from "@vercel/node";
import { RegisterInput, User } from "../types/register-input-type";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";
import connectToDatabase from "../utils/connectToDb";
import "dotenv/config";
import { InsertOneWriteOpResult } from "mongodb";
import fetch from "node-fetch";
import { signup_email_api_url } from "../utils/constants";

export default async function register(
  req: VercelRequest,
  res: VercelResponse
) {
  const { username, email, password }: RegisterInput = JSON.parse(req.body);

  if (username.length <= 2) {
    res.json({
      errors: [
        {
          field: "username",
          message: "Username should be atleast 3 charecters long",
        },
      ],
    });
    return;
  }

  if (password.length <= 5) {
    res.json({
      errors: [
        {
          field: "password",
          message: "Password should be atleast 6 charecters long",
        },
      ],
    });
    return;
  }

  if (!email.includes("@") && !email.includes(".")) {
    res.json({
      errors: [
        {
          field: "email",
          message: "Email is not formated properly",
        },
      ],
    });
    return;
  }
  console.log("hi");
  const db = await connectToDatabase(process.env.MONGO_CONNECTION_URL);

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const createdAt = Date.now().toString();
  const user: User = {
    username,
    email,
    password: hashedPassword,
    createdAt,
  };
  let savedUser: InsertOneWriteOpResult<any>;
  try {
    savedUser = await db.collection("users").insertOne(user);
  } catch (error) {
    res.status(500).json({
      error,
    });
    return;
  }
  const token = generateToken(user);

  try {
    await fetch(signup_email_api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to: email }),
    });
    console.log("email sent");
  } catch (err) {
    console.dir(err);
  }

  res.status(200).send({
    user,
    token,
  });
}
