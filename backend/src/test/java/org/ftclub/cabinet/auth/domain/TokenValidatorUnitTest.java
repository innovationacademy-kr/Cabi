package org.ftclub.cabinet.auth.domain;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.ftclub.cabinet.config.DomainProperties;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.config.MasterProperties;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.service.UserService;
import org.ftclub.cabinet.utils.DateUtil;
import org.ftclub.testutils.TestUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.security.Key;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
public class TokenValidatorUnitTest {

	static final Key mockSigningKey = TestUtils.getSigningKey("SECRET_KEY_MUST_BE_VERYVERYVERYVERYVERYVERYVERYVERYVERY_LONG");
	@Spy
	@InjectMocks
	TokenValidator tokenValidator;
	@Mock
	MasterProperties masterProperties;
	@Mock(lenient = true)
	DomainProperties domainProperties;
	@Mock
	JwtProperties jwtProperties;
	@Mock
	UserService userService;
	MockHttpServletRequest request = new MockHttpServletRequest();
	MockHttpServletResponse response = new MockHttpServletResponse();

	@BeforeEach
	void setup() {
		RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request, response));
	}

	@Test
	@DisplayName("성공: 유효한 토큰 - 유저인 경우")
	void 성공_isValidRequestWithLevel() throws JsonProcessingException {
		String userToken = TestUtils.getTestUserTokenByName(mockSigningKey, LocalDateTime.now(), DateUtil.getInfinityDate(),
				"name", "domainname.com");
		request.addHeader("Authorization", "Bearer " + userToken);
		given(jwtProperties.getSigningKey()).willReturn(mockSigningKey);
		given(masterProperties.getDomain()).willReturn("master.domain.com");
		given(domainProperties.getAdminEmailDomain()).willReturn("admin.domain.com");

		assertTrue(tokenValidator.isValidRequestWithLevel(request, AuthLevel.USER_ONLY));
		assertTrue(tokenValidator.isValidRequestWithLevel(request, AuthLevel.USER_OR_ADMIN));
		assertFalse(tokenValidator.isValidRequestWithLevel(request, AuthLevel.MASTER_ONLY));
		assertFalse(tokenValidator.isValidRequestWithLevel(request, AuthLevel.ADMIN_ONLY));
	}

	@Test
	@DisplayName("성공: 유효한 토큰 - 일반 관리자인 경우")
	void 성공_isValidRequestWithLevel2() throws JsonProcessingException {
		String adminToken = TestUtils.getTestAdminToken(mockSigningKey, LocalDateTime.now(),
				"name", "admin.domain.com");
		request.addHeader("Authorization", "Bearer " + adminToken);
		given(jwtProperties.getSigningKey()).willReturn(mockSigningKey);
		given(masterProperties.getDomain()).willReturn("master.domain.com");
		given(domainProperties.getAdminEmailDomain()).willReturn("admin.domain.com");

		assertTrue(tokenValidator.isValidRequestWithLevel(request, AuthLevel.USER_OR_ADMIN));
		assertTrue(tokenValidator.isValidRequestWithLevel(request, AuthLevel.ADMIN_ONLY));
		assertFalse(tokenValidator.isValidRequestWithLevel(request, AuthLevel.USER_ONLY));
		assertFalse(tokenValidator.isValidRequestWithLevel(request, AuthLevel.MASTER_ONLY));
	}

	@Test
	@DisplayName("성공: 유효한 토큰 - 최고 관리자인 경우")
	void 성공_isValidRequestWithLevel3() throws JsonProcessingException {
		String masterToken = TestUtils.getTestMasterToken(mockSigningKey, LocalDateTime.now(),
				"name", "master.domain.com");
		request.addHeader("Authorization", "Bearer " + masterToken);
		given(jwtProperties.getSigningKey()).willReturn(mockSigningKey);
		given(masterProperties.getDomain()).willReturn("master.domain.com");
		given(userService.getAdminUserRole("name@master.domain.com")).willReturn(AdminRole.MASTER);
		given(domainProperties.getAdminEmailDomain()).willReturn("admin.domain.com");

		assertTrue(tokenValidator.isValidRequestWithLevel(request, AuthLevel.USER_OR_ADMIN));
		assertTrue(tokenValidator.isValidRequestWithLevel(request, AuthLevel.ADMIN_ONLY));
		assertTrue(tokenValidator.isValidRequestWithLevel(request, AuthLevel.MASTER_ONLY));
		assertFalse(tokenValidator.isValidRequestWithLevel(request, AuthLevel.USER_ONLY));
	}

	@Test
	@DisplayName("실패: 유효하지 않은 토큰인 경우")
	void 실패_isValidRequestWithLevel() throws JsonProcessingException {
		request.addHeader("Authorization", "Bearer " + "token");
		given(tokenValidator.isTokenValid("token", jwtProperties.getSigningKey())).willReturn(false);

		assertFalse(tokenValidator.isValidRequestWithLevel(request, AuthLevel.ADMIN_ONLY));
		assertFalse(tokenValidator.isValidRequestWithLevel(request, AuthLevel.USER_OR_ADMIN));
		assertFalse(tokenValidator.isValidRequestWithLevel(request, AuthLevel.USER_ONLY));
	}

	@Test
	@DisplayName("실패: 헤더가 잘못된 경우")
	void 실패_isValidRequestWithLevel2() throws JsonProcessingException {
		request.addHeader("THIS_HEADER_IS_WRONG", "Bearer " + "token");

		assertFalse(tokenValidator.isValidRequestWithLevel(request, AuthLevel.ADMIN_ONLY));
		assertFalse(tokenValidator.isValidRequestWithLevel(request, AuthLevel.USER_OR_ADMIN));
		assertFalse(tokenValidator.isValidRequestWithLevel(request, AuthLevel.USER_ONLY));
	}

	@Test
	@DisplayName("실패: 토큰 인증 타입이 잘못된 경우")
	void 실패_isValidRequestWithLevel3() throws JsonProcessingException {
		request.addHeader("Authorization", "MUST_BE_BEARER " + "token");

		assertFalse(tokenValidator.isValidRequestWithLevel(request, AuthLevel.USER_OR_ADMIN));
		assertFalse(tokenValidator.isValidRequestWithLevel(request, AuthLevel.ADMIN_ONLY));
		assertFalse(tokenValidator.isValidRequestWithLevel(request, AuthLevel.USER_ONLY));
	}

	@Test
	@DisplayName("성공: 만료기한과 시그니처가 정상인 경우")
	void 성공_isTokenValid() {
		given(jwtProperties.getSigningKey()).willReturn(mockSigningKey);
		String token = TestUtils.getTestUserTokenByName(jwtProperties.getSigningKey(), LocalDateTime.now(), DateUtil.getInfinityDate(), "name", "domainname.com");

		assertTrue(tokenValidator.isTokenValid(token, jwtProperties.getSigningKey()));
	}

	@Test
	@DisplayName("실패: 시그니처가 잘못된 경우")
	void 실패_isTokenValid() {
		Key wrongKey = TestUtils.getSigningKey("WRONG_KEY_IS_MUST_BE_VERYVERYVERYVERYVERYVERY_LONG_TOO");
		Key rightKey = mockSigningKey;
		given(jwtProperties.getSigningKey()).willReturn(rightKey);
		String wrongKeyToken = TestUtils.getTestUserTokenByName(wrongKey, LocalDateTime.now(), DateUtil.getInfinityDate(), "name", "domainname.com");

		assertFalse(tokenValidator.isTokenValid(wrongKeyToken, jwtProperties.getSigningKey()));
	}

	@Test
	@DisplayName("실패: 만료기한이 지난 경우")
	void 실패_isTokenValid2() {
		given(jwtProperties.getSigningKey()).willReturn(mockSigningKey);
		String expiredToken = TestUtils.getTestUserTokenByName(jwtProperties.getSigningKey(),
				LocalDateTime.now().plusDays(-1000), DateUtil.getInfinityDate(), "name", "domainname.com");

		assertFalse(tokenValidator.isTokenValid(expiredToken, jwtProperties.getSigningKey()));
	}

	@Test
	@DisplayName("성공: 토큰의 페이로드를 JSON으로 변환")
	void 성공_getPayloadJson() throws JsonProcessingException {
		given(jwtProperties.getSigningKey()).willReturn(mockSigningKey);
		String token = TestUtils.getTestUserTokenByName(jwtProperties.getSigningKey(), LocalDateTime.now(), DateUtil.getInfinityDate(),
				"sanan", "domainname.com");
		JsonNode payloadJson = tokenValidator.getPayloadJson(token);

		assertTrue(payloadJson.get("name").asText().equals("sanan"));
	}

	@Test
	@DisplayName("실패: 페이로드에 찾는 키가 없을 때")
	void 실패_getPayloadJson() throws JsonProcessingException {
		given(jwtProperties.getSigningKey()).willReturn(mockSigningKey);
		String token = TestUtils.getTestUserTokenByName(jwtProperties.getSigningKey(), LocalDateTime.now(), DateUtil.getInfinityDate(),
				"sanan", "domainname.com");

		JsonNode payloadJson = tokenValidator.getPayloadJson(token);

		assertNull(payloadJson.get("wrong_key"));
	}

	@Test
	@DisplayName("유저일 때 USER_ONLY, USER_OR_ADMIN만 인가됨")
	void 성공_isTokenAuthenticatable() throws JsonProcessingException {
		given(jwtProperties.getSigningKey()).willReturn(mockSigningKey);
		given(masterProperties.getDomain()).willReturn("master.domain.com");
		given(domainProperties.getAdminEmailDomain()).willReturn("admin.domain.com");
		String token = TestUtils.getTestUserTokenByName(jwtProperties.getSigningKey(), LocalDateTime.now(), DateUtil.getInfinityDate(),
				"sanan", "domainname.com");

		assertTrue(tokenValidator.isTokenAuthenticatable(token, AuthLevel.USER_ONLY));
		assertTrue(tokenValidator.isTokenAuthenticatable(token, AuthLevel.USER_OR_ADMIN));
		assertFalse(tokenValidator.isTokenAuthenticatable(token, AuthLevel.ADMIN_ONLY));
		assertFalse(tokenValidator.isTokenAuthenticatable(token, AuthLevel.MASTER_ONLY));
	}

	@Test
	@DisplayName("일반 관리자일 때 ADMIN_ONLY, USER_OR_ADMIN만 인가됨")
	void 성공_isTokenAuthenticatable2() throws JsonProcessingException {
		given(jwtProperties.getSigningKey()).willReturn(mockSigningKey);
		given(masterProperties.getDomain()).willReturn("master.domain.com");
		given(domainProperties.getAdminEmailDomain()).willReturn("admin.domain.com");
		String adminToken = TestUtils.getTestAdminToken(jwtProperties.getSigningKey(), LocalDateTime.now(), "sanan", "admin.domain.com");

		assertTrue(tokenValidator.isTokenAuthenticatable(adminToken, AuthLevel.ADMIN_ONLY));
		assertTrue(tokenValidator.isTokenAuthenticatable(adminToken, AuthLevel.USER_OR_ADMIN));
		assertFalse(tokenValidator.isTokenAuthenticatable(adminToken, AuthLevel.USER_ONLY));
		assertFalse(tokenValidator.isTokenAuthenticatable(adminToken, AuthLevel.MASTER_ONLY));
	}

	@Test
	@DisplayName("최고 관리자일 때 ADMIN_ONLY, USER_OR_ADMIN, MASTER_ONLY 인가됨")
	void 성공_isTokenAuthenticatable3() throws JsonProcessingException {
		given(jwtProperties.getSigningKey()).willReturn(mockSigningKey);
		given(masterProperties.getDomain()).willReturn("master.domain.com");
		given(domainProperties.getAdminEmailDomain()).willReturn("admin.domain.com");
		given(userService.getAdminUserRole("sanan@master.domain.com")).willReturn(AdminRole.MASTER);
		String masterToken = TestUtils.getTestMasterToken(jwtProperties.getSigningKey(), LocalDateTime.now(), "sanan", "master.domain.com");

		assertTrue(tokenValidator.isTokenAuthenticatable(masterToken, AuthLevel.ADMIN_ONLY));
		assertTrue(tokenValidator.isTokenAuthenticatable(masterToken, AuthLevel.USER_OR_ADMIN));
		assertTrue(tokenValidator.isTokenAuthenticatable(masterToken, AuthLevel.MASTER_ONLY));
		assertFalse(tokenValidator.isTokenAuthenticatable(masterToken, AuthLevel.USER_ONLY));
	}
}
