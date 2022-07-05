import { userInfo } from "../../models/types";
import { secret } from "../../config/jwtConfig";
import jwt from "jsonwebtoken";

const TOKEN_EXPIRED: number = -3;
const TOKEN_INVALID: number = -2;

export const jwtToken = {
  sign: async (user: userInfo) => {
    return {
      accessToken : jwt.sign(user, secret.secretKey, secret.options)
    }
  },
  verify: async (token: string) => {
    try {
      return jwt.verify(token, secret.secretKey);
    } catch (err: any) {
      if (err.message === "jwt expired") {
        return TOKEN_EXPIRED;
      } else if (err.message === "invalid token") {
        return TOKEN_INVALID;
      } else {
        return TOKEN_INVALID;
      }
    }
  }
}

export const verifyToken = async (token: string, res: any): Promise<userInfo | undefined> => {
  if (!token) {
    res.status(401).send({ error : 'verify token not exist' });
    return undefined;
  }
  const decoded = await jwtToken.verify(token) as userInfo;
  if (typeof decoded === "number") {
    if (decoded === TOKEN_EXPIRED) {
      res.status(419).send({ error: "Expired token" });
    } else if (decoded === TOKEN_INVALID) {
      res.status(401).send({ error: "Invalid token" });
    }
    return undefined;
  }
  return decoded;
}

// export const verifyAndRedirect = async (token: string, res: any): Promise<userInfo | undefined> => {
//   if (!token) {
//     res.status(401).redirect("/");
//     return undefined;
//   }
//   const decoded = await jwtToken.verify(token) as userInfo;
//   if (typeof decoded === "number"){
//     if (decoded === TOKEN_EXPIRED) {
//       res.status(419).redirect("/");
//     } else if (decoded === TOKEN_INVALID) {
//       res.status(401).redirect("/");
//     }
//     return undefined;
//   }
//   return decoded;
// }
