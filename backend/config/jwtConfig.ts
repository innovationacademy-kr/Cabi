import jwt from "jsonwebtoken";

type jwtSecret = {
	secretKey: string,
	options: jwt.SignOptions,
}

export const secret: jwtSecret = {
	secretKey: process.env.JWT_SECRETKEY ? process.env.JWT_SECRETKEY : 'SecretKey',
	options: {
		algorithm: "HS256",
    	expiresIn: "30m",
    	issuer: "42cabi"
	}
}
