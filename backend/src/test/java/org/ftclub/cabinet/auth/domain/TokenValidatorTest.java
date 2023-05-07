package org.ftclub.cabinet.auth.domain;

import java.util.Date;
import org.ftclub.cabinet.auth.TokenProvider;
import org.ftclub.cabinet.auth.TokenValidator;
import org.ftclub.cabinet.utils.DateUtil;
import org.json.JSONObject;
import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;

@SpringBootTest(properties = {"spring.config.location=classpath:application-oauth.yml"})
public class TokenValidatorTest {

	@Autowired
	TokenValidator tokenValidator;

	@Autowired
	TokenProvider tokenProvider;

	@Test
	void 헤더의_토큰_유효한지_아닌지() {
		MockHttpServletRequest validTokenRequest = new MockHttpServletRequest();
		MockHttpServletRequest invalidTokenRequest = new MockHttpServletRequest();
		MockHttpServletRequest emptyTokenRequest = new MockHttpServletRequest();

		String validToken = tokenProvider.createToken("ft",
				new JSONObject().put("intra_id", "sanan"), new Date());
		validTokenRequest.addHeader("Authorization", "Bearer " + validToken);
		String invalidToken = tokenProvider.createToken("google",
				new JSONObject().put("intra_id", "sanan"), DateUtil.stringToDate("2000-01-01"));

		System.out.println("validToken: " + validToken);
		System.out.println("invalidToken: " + invalidToken);
		invalidTokenRequest.addHeader("Authorization", "Bearer " + invalidToken);
		invalidTokenRequest.addHeader("Authorization", "Bearer " + invalidToken);
		Assert.assertEquals(true,
				tokenValidator.isTokenValid(validTokenRequest));
		Assert.assertEquals(false,
				tokenValidator.isTokenValid(emptyTokenRequest));
	}

	@Test
	void 토큰_유효성_검사() {
		String validToken = tokenProvider.createToken("ft",
				new JSONObject().put("intra_id", "sanan"), new Date());
		String invalidToken = tokenProvider.createToken("google",
				new JSONObject().put("intra_id", "sanan"), DateUtil.stringToDate("2000-01-01"));

		Assert.assertEquals(true, tokenValidator.checkTokenValidity(validToken));
		Assert.assertEquals(false, tokenValidator.checkTokenValidity(invalidToken));
	}
}
