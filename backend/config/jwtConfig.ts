import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

type jwtSecret = {
	secretKey: string,
	options: jwt.SignOptions,
}

export const secret: jwtSecret = {
	secretKey: process.env.JWT_SECRETKEY ? process.env.JWT_SECRETKEY : 'SecretKey',
	options: {
		// algorithm: process.env.JWT_ALGORITHM,
    expiresIn: process.env.JWT_EXPIREIN,
    issuer: process.env.JWT_ISSUER,
	}
}
