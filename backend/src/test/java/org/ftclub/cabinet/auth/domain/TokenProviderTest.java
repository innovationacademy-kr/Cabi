package org.ftclub.cabinet.auth.domain;

import java.util.Date;
import java.util.Map;
import org.ftclub.cabinet.auth.TokenProvider;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.config.GoogleApiProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.user.domain.UserRole;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {"spring.config.location=classpath:application-oauth.yml"})
public class TokenProviderTest {

	@Autowired
	TokenProvider tokenProvider;

	@Autowired
	GoogleApiProperties googleApiProperties;

	@Autowired
	FtApiProperties ftApiProperties;

	@Autowired
	JwtProperties jwtProperties;

	@Test
	void 토큰_클레임_생성() {
		JSONObject googleProfile = new JSONObject();
		JSONObject ftProfile = new JSONObject();
		String googleEmail = "dongledongledongglee@google.com";
		String ftIntraId = "yooh";
		String ftEmail = "inshin@member.kr";
		googleProfile.put("email", googleEmail);
		ftProfile.put("login", ftIntraId);
		ftProfile.put("cursus_users", new JSONArray(new JSONObject[]{
				new JSONObject().put("zero_index", new Date()),
				new JSONObject().put("blackholed_at", new Date())}));
		ftProfile.put("email", ftEmail);

		Map<String, Object> googleClaims = tokenProvider.makeClaims(googleApiProperties.getName(),
				googleProfile);
		Map<String, Object> ftClaims = tokenProvider.makeClaims(ftApiProperties.getName(),
				ftProfile);

		Assertions.assertEquals(googleEmail, googleClaims.get("email"));
		Assertions.assertEquals(ftIntraId, ftClaims.get("intra_id"));
		Assertions.assertEquals(ftEmail, ftClaims.get("email"));
		Assertions.assertEquals(UserRole.USER, ftClaims.get("role"));
	}

	@Test
	void 토큰_생성() {
		JSONObject ftProfile = new JSONObject();
		String ftIntraId = "yooh";
		String ftEmail = "inshin@member.kr";
		ftProfile.put("login", ftIntraId);
		ftProfile.put("cursus_users", new JSONArray(new JSONObject[]{
				new JSONObject().put("zero_index", new Date()),
				new JSONObject().put("blackholed_at", new Date())}));
		ftProfile.put("email", ftEmail);

		String token = tokenProvider.createToken(ftApiProperties.getName(), ftProfile, new Date());

		Assertions.assertNotNull(token);
	}
}
