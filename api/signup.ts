import { VercelRequest, VercelResponse } from "@vercel/node";
import { RegisterInput, User } from "../types/register-input-type";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";
import connectToDatabase from "../utils/connectToDb";
import "dotenv/config";
import { InsertOneWriteOpResult } from "mongodb";
import fetch from "node-fetch";

export default async function register(
  req: VercelRequest,
  res: VercelResponse
) {
  const { username, email, password }: RegisterInput = req.body;
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
  }
  const token = generateToken(user);

  try {
    await fetch("http://localhost:3001/api/signup", {
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
