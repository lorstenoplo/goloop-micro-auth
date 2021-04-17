export const __prod__ = process.env.NODE_ENV === "production";
export const signup_email_api_url = __prod__
  ? "https://goloop-micro-email.vercel.app/api/signup"
  : "http://localhost:3003/api/signup";
