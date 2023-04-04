package org.ftclub.cabinet.auth;

import org.springframework.stereotype.Component;

@Component
public class TokenValidator {

	public static Boolean isTokenValid(String token, String role) {
		if (role == "USER") {
			System.out.printf("subject = %s\n", TokenProvider.getSubject(token));
			if (TokenProvider.getSubject(token).equals("hello!")) {
				System.out.printf("token is validated!\n", token);
				return (true);
			}
			System.out.printf("token is invalid!\n", token);
			return false;
		}
		if (role == "ADMIN") {
			System.out.printf("token is ADMIN!\n", token);
			return (true);
		}
		System.out.printf("token is invalid final!\n", token);
		return (false);
	}
}
