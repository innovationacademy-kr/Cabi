package org.ftclub.cabinet.auth.domain;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Date;
import java.util.Map;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.config.GoogleApiProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.domain.UserRole;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TokenProviderTest {

	@Autowired
	TokenProvider tokenProvider;

	@Autowired
	GoogleApiProperties googleApiProperties;

	@Autowired
	FtApiProperties ftApiProperties;

	@Autowired
	JwtProperties jwtProperties;

	ObjectMapper objectMapper = new ObjectMapper();

	@Test
	void 토큰_클레임_생성() throws JsonProcessingException {
		String googleEmail = "dongledongledongglee@google.com";
		String ftIntraId = "yooh";
		String ftEmail = "inshin@member.kr";
		JSONObject googleProfile = new JSONObject()
				.put("email", googleEmail);
		JSONObject ftProfile = new JSONObject()
				.put("login", ftIntraId)
				.put("cursus_users", new JSONArray(new JSONObject[]{
						new JSONObject().put("zero_index", new Date()),
						new JSONObject().put("blackholed_at", new Date())}))
				.put("email", ftEmail);

		Map<String, Object> googleClaims = tokenProvider.makeClaimsByProviderProfile(
				googleApiProperties.getProviderName(),
				objectMapper.readTree(googleProfile.toString()));
		Map<String, Object> ftClaims = tokenProvider.makeClaimsByProviderProfile(
				ftApiProperties.getProviderName(),
				objectMapper.readTree(ftProfile.toString()));

		Assertions.assertEquals(googleEmail, googleClaims.get("email"));
		Assertions.assertEquals(ftIntraId, ftClaims.get("name"));
		Assertions.assertEquals(ftEmail, ftClaims.get("email"));
		Assertions.assertEquals(UserRole.USER, ftClaims.get("role"));
	}

	/**
	 * 지정하는 국가의 카뎃이 아닌 경우 클레임 생성에 실패합니다.
	 */
	@Test
	void 토큰_클레임_생성_실패() throws JsonProcessingException {
		String ftIntraId = "foreign";
		String ftEmail = "foreginer@member.fr";
		JSONObject ftProfile = new JSONObject()
				.put("login", ftIntraId)
				.put("cursus_users", new JSONArray(new JSONObject[]{
						new JSONObject().put("zero_index", new Date()),
						new JSONObject().put("blackholed_at", new Date())}))
				.put("email", ftEmail);

		Assertions.assertThrows(ServiceException.class, () ->
		{
			tokenProvider.makeClaimsByProviderProfile(ftApiProperties.getProviderName(),
					objectMapper.readTree(ftProfile.toString()));
		});
	}

//	@Test
//	void 토큰_생성() throws JsonProcessingException {
//		ObjectMapper objectMapper = new ObjectMapper();
//		JSONObject ftProfile = new JSONObject();
//		String ftIntraId = "yooh";
//		String ftEmail = "inshin@member.kr";
//		ftProfile.put("login", ftIntraId);
//		ftProfile.put("cursus_users", new JSONArray(new JSONObject[]{
//				new JSONObject().put("zero_index", new Date()),
//				new JSONObject().put("blackholed_at", new Date())}));
//		ftProfile.put("email", ftEmail);
//
//		String token = tokenProvider.createToken(ftApiProperties.getProviderName(),
//				objectMapper.readTree(ftProfile.toString()),
//				new Date());
//
//		Assertions.assertNotNull(token);
//	}
}
