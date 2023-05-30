package org.ftclub.cabinet.auth.domain;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Date;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.utils.DateUtil;
import org.ftclub.testutils.TestControllerUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Assert;
import org.junit.jupiter.api.BeforeEach;
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

	ObjectMapper objectMapper;
	JSONObject googleProfile;
	JSONObject ftKoreanProfile;
	JSONObject ftForeignerProfile;

	@BeforeEach
	void setup() {
		objectMapper = new ObjectMapper();
		googleProfile = new JSONObject()
				.put("email", "email");
		ftKoreanProfile = new JSONObject()
				.put("login", "testUserName")
				.put("cursus_users", new JSONArray(new JSONObject[]{
						new JSONObject().put("zero_index", new Date()),
						new JSONObject().put("blackholed_at", new Date())}))
				.put("email", "testUser@student.42seoul.kr");
		ftForeignerProfile = new JSONObject()
				.put("login", "testUserName")
				.put("cursus_users", new JSONArray(new JSONObject[]{
						new JSONObject().put("zero_index", new Date()),
						new JSONObject().put("blackholed_at", new Date())}))
				.put("email", "testUser@student.42ecole.fr");
	}

	@Test
	void 헤더의_토큰_유효한지_아닌지() throws JsonProcessingException {
		MockHttpServletRequest validTokenRequest = new MockHttpServletRequest();
		MockHttpServletRequest invalidTokenRequest = new MockHttpServletRequest();
		MockHttpServletRequest emptyTokenRequest = new MockHttpServletRequest();

		String validToken = tokenProvider.createToken("ft",
				objectMapper.readTree(ftKoreanProfile.toString()), DateUtil.getNow());
		validTokenRequest.addHeader("Authorization", "Bearer " + validToken);
		String invalidToken = tokenProvider.createToken("google",
				objectMapper.readTree(googleProfile.toString()),
				DateUtil.stringToDate("2000-01-01"));

		invalidTokenRequest.addHeader("Authorization", "Bearer " + invalidToken);
		invalidTokenRequest.addHeader("Authorization", "Bearer " + invalidToken);
		Assert.assertEquals(true,
				tokenValidator.isTokenValid(validTokenRequest));
		Assert.assertEquals(false,
				tokenValidator.isTokenValid(emptyTokenRequest));
	}

	@Test
	void 토큰_유효성_검사() throws JsonProcessingException {
		String validToken = tokenProvider.createToken("ft",
				objectMapper.readTree(ftKoreanProfile.toString()),
				new Date());
		String invalidToken = tokenProvider.createToken("google",
				objectMapper.readTree(googleProfile.toString()),
				DateUtil.stringToDate("2000-01-01"));

		Assert.assertEquals(true, tokenValidator.checkTokenValidity(validToken));
		Assert.assertEquals(false, tokenValidator.checkTokenValidity(invalidToken));
	}

	@Test
	void 토큰_페이로드_가져오기() throws JsonProcessingException {
		String userToken = TestControllerUtils.getTestUserToken(jwtProperties.getSigningKey());
		Assert.assertEquals("testUserName",
				tokenValidator.getPayloadJson(userToken).get("name").asText());
	}
}
