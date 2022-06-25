import { jwt } from "jsonwebtoken";

type jwtSecret = {
	secretKey: string,
	options: jwt.SignOptions,
}

export const secret: jwtSecret = {
	secretKey: process.env.JWT_SECRETKEY ? process.env.JWT_SECRETKEY : 'SecretKey',
	options: {
		algorithm: process.env.JWT_ALGORITHM,
		expireIn: process.env.JWT_EXPIRESIN,
		issuer: process.env.JWT_ISSUER,
	}
}
