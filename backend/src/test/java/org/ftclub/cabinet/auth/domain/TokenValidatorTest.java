package org.ftclub.cabinet.auth.domain;

import java.util.Date;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.utils.DateUtil;
import org.ftclub.testutils.TestControllerUtils;
import org.json.JSONObject;
import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;

@SpringBootTest
public class TokenValidatorTest {

	@Autowired
	TokenValidator tokenValidator;

	@Autowired
	TokenProvider tokenProvider;

	@Autowired
	JwtProperties jwtProperties;

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

	@Test
	void 토큰_페이로드_가져오기() {
		String userToken = TestControllerUtils.getTestUserToken(jwtProperties.getSigningKey());
		Assert.assertEquals("testUserName", tokenValidator.getPayloadJson(userToken).get("name"));
	}
}
