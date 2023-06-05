package org.ftclub.cabinet.user.controller;

import static org.ftclub.testutils.TestControllerUtils.mockRequest;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import javax.servlet.http.Cookie;
import javax.transaction.Transactional;
import org.ftclub.cabinet.config.JwtProperties;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.utils.DateUtil;
import org.ftclub.testutils.TestControllerUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class UserControllerTest {

	@Autowired
	MockMvc mockMvc;

	@Autowired
	JwtProperties jwtProperties;

	@Test
	public void testGetMyProfile_대여_사물함_없는_경우() throws Exception {
		// penaltyuser2 대여 중인 사물함 x 벤 기록 x
		MyProfileResponseDto myProfileResponseDto = new MyProfileResponseDto(4L, "penaltyuser2",
				-1L, null);

		String userToken = TestControllerUtils.getTestUserTokenByName(jwtProperties.getSigningKey(),
				"penaltyuser2", DateUtil.getNow());
		Cookie cookie = TestControllerUtils.getTokenCookie("사용자", userToken);

		mockMvc.perform(mockRequest(HttpMethod.GET, cookie,
						"/api/users/me"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.userId").value(myProfileResponseDto.getUserId()))
				.andExpect(jsonPath("$.name").value(myProfileResponseDto.getName()))
				.andExpect(jsonPath("$.cabinetId").value(myProfileResponseDto.getCabinetId()))
				.andExpect(jsonPath("$.unbannedAt").value(myProfileResponseDto.getUnbannedAt()));
	}

	@Test
	public void testGetMyProfile_대여_사물함_있는_경우() throws Exception {
		// lentuser1 대여 중인 사물함 3번
		MyProfileResponseDto myProfileResponseDto = new MyProfileResponseDto(5L, "lentuser1",
				3L, null);

		String userToken = TestControllerUtils.getTestUserTokenByName(jwtProperties.getSigningKey(),
				"lentuser1", DateUtil.getNow());
		Cookie cookie = TestControllerUtils.getTokenCookie("사용자", userToken);
		mockMvc.perform(mockRequest(HttpMethod.GET, cookie,
						"/api/users/me"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.userId").value(myProfileResponseDto.getUserId()))
				.andExpect(jsonPath("$.name").value(myProfileResponseDto.getName()))
				.andExpect(jsonPath("$.cabinetId").value(myProfileResponseDto.getCabinetId()))
				.andExpect(jsonPath("$.unbannedAt").value(myProfileResponseDto.getUnbannedAt()));
	}

	// 완전히 구현되어 있지 않은 메서드
//	@Test
//	public void testGetMyLentAndCabinetInfo() throws Exception {
//		// lentuser1 대여 중인 사물함 3번
//		String userToken = TestControllerUtils.getTestUserTokenByName(jwtProperties.getSigningKey(),
//				"lentuser1");
//		Cookie cookie = TestControllerUtils.getTokenCookie("사용자", userToken);
//		mockMvc.perform(mockRequest(HttpMethod.GET, cookie,
//						"/api/users/me/lent"))
//				.andExpect(status().isOk())
//				.andExpect(jsonPath("$.userId").value(5L))
//				.andExpect(jsonPath("$.cabinetId").value(3L));
//	}

//	@Test
//	public void testGetMyLentHistories() throws Exception {
//		// lentuser1 대여 중인 사물함 3번
//		String userToken = TestControllerUtils.getTestUserTokenByName(jwtProperties.getSigningKey(),
//				"lentuser1");
//		Cookie cookie = TestControllerUtils.getTokenCookie("사용자", userToken);
//		mockMvc.perform(mockRequest(HttpMethod.GET, cookie,
//						"/api/users/me/lent/histories").param("page", "0").param("length", "10"))
//				.andExpect(status().isOk())
//				.andExpect(jsonPath("$.totalLength").value(11));
//	}
}

