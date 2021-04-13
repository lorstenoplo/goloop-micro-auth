import jwt from "jsonwebtoken";

export default function generateToken(user: any) {
  return jwt.sign(
    {
      id: user?._id,
    },
    process.env.JWT_KEY || "@njkddm#jkim"
  );
}
