package org.ftclub.testutils;

import static org.mockito.Mockito.mock;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.security.Key;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.crypto.spec.SecretKeySpec;
import javax.servlet.http.Cookie;
import javax.xml.bind.DatatypeConverter;
import org.ftclub.cabinet.admin.admin.domain.AdminRole;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;


public class TestUtils {

	public static String getTestAdminToken(Key signingKey, LocalDateTime now, String emailName,
			String emailDomain) {
		Map<String, Object> claim = new HashMap<>();
		claim.put("email", emailName + "@" + emailDomain);
		claim.put("role", AdminRole.ADMIN);
		return Jwts.builder()
				.setClaims(claim)
				.signWith(signingKey, SignatureAlgorithm.HS256)
				.setExpiration(DateUtil.toDate(now.plusDays(10)))
				.compact();
	}

	public static String getTestMasterToken(Key signingKey, LocalDateTime now, String emailName,
			String emailDomain) {
		Map<String, Object> claim = new HashMap<>();
		claim.put("email", emailName + "@" + emailDomain);
		claim.put("role", AdminRole.MASTER);
		return Jwts.builder()
				.setClaims(claim)
				.signWith(signingKey, SignatureAlgorithm.HS256)
				.setExpiration(DateUtil.toDate(now.plusDays(10)))
				.compact();
	}

	public static String getTestUserTokenByName(Key signingKey, LocalDateTime now,
			LocalDateTime blackholedAt, String name, String emailDomain) {
		Map<String, Object> claim = new HashMap<>();
		claim.put("name", name);
		claim.put("email", name + "@" + emailDomain);
		claim.put("blackholedAt", DateUtil.toDate(blackholedAt));
		claim.put("role", "USER");
		return Jwts.builder()
				.setClaims(claim)
				.signWith(signingKey, SignatureAlgorithm.HS256)
				.setExpiration(DateUtil.toDate(now.plusDays(10)))
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

	public static Key getSigningKey(String secretKey) {
		byte[] secretKeyBytes = DatatypeConverter.parseBase64Binary(secretKey);
		return new SecretKeySpec(secretKeyBytes, SignatureAlgorithm.HS256.getJcaName());
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

	// 특정 타입의 객체를 ArrayList<mock(T.class)> 반환
	public static <T> List<T> createTestMockList(Class<T> type, int count) {
		List<T> list = new ArrayList<>();
		try {
			for (int i = 0; i < count; i++) {
				list.add(mock(type));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}
}
