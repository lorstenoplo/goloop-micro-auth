import { VercelRequest, VercelResponse } from "@vercel/node";
import connectToDatabase from "../utils/connectToDb";
import fetch from "node-fetch";
import { bye_email_api_url } from "../utils/constants";

export default async function deleteUser(
  req: VercelRequest,
  res: VercelResponse
) {
  const { email, username } = JSON.parse(req.body);

  const db = await connectToDatabase(process.env.MONGO_CONNECTION_URL);
  const deletedUser = await db.collection("users").deleteOne({ email });

  if (!deletedUser) {
    res.status(500).json({
      deletedUser: null,
    });
    return;
  }

  try {
    const res = await fetch(bye_email_api_url, {
      method: "POST",
      body: JSON.stringify({
        to: email,
        username,
      }),
    });
  } catch (error) {
    console.error("couldn't send email");
  }

  res.json({ deletedUser: true });
}
