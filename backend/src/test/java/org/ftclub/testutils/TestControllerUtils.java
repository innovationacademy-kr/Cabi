package org.ftclub.testutils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.Cookie;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

public class TestControllerUtils {

	public static String getTestAdminToken(Key signingKey) {
		Map<String, Object> claim = new HashMap<>();
		claim.put("email", "test@gmail.com");
		return Jwts.builder()
				.setClaims(claim)
				.signWith(signingKey, SignatureAlgorithm.HS256)
				.setExpiration(DateUtil.addDaysToDate(new Date(), 10))
				.compact();
	}

	public static String getTestUserToken(Key signingKey) {
		Map<String, Object> claim = new HashMap<>();
		claim.put("name", "testUserName");
		claim.put("email", "test@student.42seoul.kr");
		claim.put("blackholedAt", new Date());
		claim.put("role", UserRole.USER);
		return Jwts.builder()
				.setClaims(claim)
				.signWith(signingKey, SignatureAlgorithm.HS256)
				.setExpiration(DateUtil.addDaysToDate(new Date(), 10))
				.compact();
	}

	public static String getTestUserTokenByName(Key signingKey, String name) {
		Map<String, Object> claim = new HashMap<>();
		claim.put("name", name);
		claim.put("email", name + "@student.42seoul.kr");
		claim.put("blackholedAt", new Date());
		claim.put("role", UserRole.USER);
		return Jwts.builder()
				.setClaims(claim)
				.signWith(signingKey, SignatureAlgorithm.HS256)
				.setExpiration(DateUtil.addDaysToDate(new Date(), 10))
				.compact();
	}

	public static Cookie getTokenCookie(String role, String token) {
		String tokenName;
		if (role.equals("관리자")) {
			tokenName = "admin_access_token";
		} else if (role.equals("사용자")) {
			tokenName = "access_token";
		} else {
			tokenName = "invalid_token";
		}
		return new Cookie(tokenName, token);
	}

	public static MockHttpServletRequestBuilder mockRequest(HttpMethod method, Cookie cookie,
			String url, Object... uriVars) {
		if (method.equals(HttpMethod.GET)) {
			return MockMvcRequestBuilders.get(url, uriVars)
					.cookie(cookie)
					.header(HttpHeaders.AUTHORIZATION, "Bearer " + cookie.getValue());
		}
		if (method.equals(HttpMethod.POST)) {
			return MockMvcRequestBuilders.post(url, uriVars)
					.cookie(cookie)
					.header(HttpHeaders.AUTHORIZATION, "Bearer " + cookie.getValue());
		}
		if (method.equals(HttpMethod.PATCH)) {
			return MockMvcRequestBuilders.patch(url, uriVars)
					.cookie(cookie)
					.header(HttpHeaders.AUTHORIZATION, "Bearer " + cookie.getValue());
		}
		if (method.equals(HttpMethod.DELETE)) {
			return MockMvcRequestBuilders.delete(url, uriVars)
					.cookie(cookie)
					.header(HttpHeaders.AUTHORIZATION, "Bearer " + cookie.getValue());
		}
		throw new RuntimeException("Invalid HTTP Method Type!!!!!!!!");
	}
}
