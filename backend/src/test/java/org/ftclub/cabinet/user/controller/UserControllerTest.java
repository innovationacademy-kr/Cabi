package org.ftclub.cabinet.user.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.user.service.UserFacadeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

//@RunWith(SpringRunner.class)
@WebMvcTest(controllers = UserController.class)
// @AutoConfigureMockMvc
// @Transactional
public class UserControllerTest {

	@Autowired
	private MockMvc mockMvc;
	@Autowired
	private ObjectMapper objectMapper;

	@MockBean
	private UserFacadeService userFacadeService;

	@Test
	public void testGetMyProfile() throws Exception {
		// penaltyuser2 대여 중인 사물함 x 벤 기록 x
		UserSessionDto userSessionDto = new UserSessionDto(4L, "penaltyuser2",
				"penaltyuser2@student.42seoul.kr", null, null, null, false);
		String user = objectMapper.writeValueAsString(userSessionDto);
		MyProfileResponseDto myProfileResponseDto = new MyProfileResponseDto(4L, "penaltyuser2",
				-1L);

		// ?
		when(userFacadeService.getMyProfile(userSessionDto)).thenReturn(myProfileResponseDto);

		mockMvc.perform(MockMvcRequestBuilders.get("/api/users/me").contentType(
						MediaType.APPLICATION_JSON).content(user))
				.andExpect(status().isOk())
				.andDo(print());
	}

	// getMyLentAndCabinetInfo, getMyLentHistories 메소드에 대한 테스트 코드 추가...

}

