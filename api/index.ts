import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function welcome(req: VercelRequest, res: VercelResponse) {
  const { name = "world" } = req.query;
  res.status(200).send(`hell ${name}`);
}
