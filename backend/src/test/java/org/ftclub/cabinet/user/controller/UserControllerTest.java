package org.ftclub.cabinet.user.controller;

import static org.ftclub.testutils.TestControllerUtils.mockRequest;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import javax.servlet.http.Cookie;
import javax.transaction.Transactional;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.ftclub.testutils.TestControllerUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpMethod;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class UserControllerTest {

	@Autowired
	private MockMvc mockMvc;
	@Autowired
	private ObjectMapper objectMapper;

	@MockBean
	private UserFacadeService userFacadeService;

	@Autowired
	JwtProperties jwtProperties;

	@Test
	public void testGetMyProfile() throws Exception {
		// penaltyuser2 대여 중인 사물함 x 벤 기록 x
		MyProfileResponseDto myProfileResponseDto = new MyProfileResponseDto(4L, "penaltyuser2",
				-1L);

		String userToken = TestControllerUtils.getTestUserTokenByName(jwtProperties.getSigningKey(),
				"penaltyuser2");
		Cookie cookie = TestControllerUtils.getTokenCookie("사용자", userToken);

		mockMvc.perform(mockRequest(HttpMethod.GET, cookie,
						"/api/users/me"))
				.andExpect(status().isOk())
				.andDo(print());
	}

	// getMyLentAndCabinetInfo, getMyLentHistories 메소드에 대한 테스트 코드 추가...

}

