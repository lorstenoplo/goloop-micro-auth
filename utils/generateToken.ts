import jwt from "jsonwebtoken";

export default function generateToken(user: any) {
  return jwt.sign(
    {
      id: user?.id,
      username: user?.username,
    },
    process.env.JWT_KEY || "@njkddm#jkim"
  );
}
