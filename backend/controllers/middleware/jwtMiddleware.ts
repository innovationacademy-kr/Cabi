import { userInfo } from "../../models/types";
import { secret } from "../../config/jwtConfig";
import jwt from "jsonwebtoken";

const TOKEN_EXPIRED: number = -3;
const TOKEN_INVALID: number = -2;

// export interface userInfo {
//   user_id: number;
//   intra_id: string;
//   auth?: boolean | undefined;
//   email?: string;
//   phone?: string | undefined;
//   access?: string;
//   refresh?: string;
// }

export const jwtToken = {
  sign: async (user: userInfo) => {
    const result = {
      accessToken : jwt.sign(user, secret.secretKey, secret.options)
    }
    return result;
  },
  verify: async (token: string) => {
    let decoded;
    try {
      decoded = jwt.verify(token, secret.secretKey);
    } catch (err: any) {
      if (err.message === "jwt expired") {
        console.error('expired token');
        return TOKEN_EXPIRED;
      } else if (err.message === "invalid token") {
        console.error('invalid token');
        return TOKEN_INVALID;
      } else {
        console.error('invalid token');
        return TOKEN_INVALID;
      }
    }
    return decoded;
  }
}

export const verifyToken = async (req: any, res:any): Promise<userInfo | undefined> => {
  try {
    const decoded = await jwtToken.verify(req.cookie.accessToken) as userInfo;
    if (typeof decoded === "number") {
      if (decoded === TOKEN_EXPIRED) {
        res.status(419).send({ error: "Expired token" });
      } else if (decoded === TOKEN_INVALID) {
        res.status(401).send({ error: "Invalid token" });
      }
      return undefined;
    }
    return decoded;
  } catch (err: any) {
    console.error('verifyToken - ', err.message);
    res.status(400).send({ error: err.message });
  }
}

export const verifyAndRedirect = async (req:any, res: any): Promise<userInfo | undefined> => {
  try {
    const decoded = await jwtToken.verify(req.cookies.accessToken) as userInfo;
    if (typeof decoded === "number"){
      if (decoded === TOKEN_EXPIRED) {
        res.status(419).redirect("/");
      } else if (decoded === TOKEN_INVALID) {
        res.status(401).redirect("/");
      }
    } else {
      return decoded;
    }
    return undefined;
  } catch (err: any) {
    console.error('verifyAndRedirect - ', err);
    res.state(400).redirect("/");
  }
}
