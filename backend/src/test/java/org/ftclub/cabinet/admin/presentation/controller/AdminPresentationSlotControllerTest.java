package org.ftclub.cabinet.admin.presentation.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import org.ftclub.cabinet.admin.dto.AdminPresentationSlotRequestDto;
import org.ftclub.cabinet.admin.presentation.service.AdminPresentationSlotService;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest
@AutoConfigureMockMvc
class AdminPresentationSlotControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockBean
	private AdminPresentationSlotService adminPresentationSlotService;

	@DisplayName("어드민이 프레젠테이션 슬롯을 생성하여 등록한다.")
	@WithMockUser(roles = "ADMIN")
	@Test
	void registerPresentationSlot() throws Exception {
		// given
		AdminPresentationSlotRequestDto requestDto = new AdminPresentationSlotRequestDto(
				LocalDateTime.now().plusDays(1),
				PresentationLocation.BASEMENT
		);
		// then
		mockMvc.perform(MockMvcRequestBuilders.post("/v6/admin/presentations/slots")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(requestDto))
				)
				.andExpect(MockMvcResultMatchers.status().isOk());
	}

	@DisplayName("어드민이 아닌 유저가 슬롯을 생성하려고 하면 403 에러가 발생한다.")
	@WithMockUser(roles = "USER")
	@Test
	void registerPresentationSlotByNotAdmin() throws Exception {
		// given
		AdminPresentationSlotRequestDto requestDto = new AdminPresentationSlotRequestDto(
				LocalDateTime.now().plusDays(1),
				PresentationLocation.BASEMENT
		);
		// then
		mockMvc.perform(MockMvcRequestBuilders.post("/v6/admin/presentations/slots")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(requestDto))
				)
				.andExpect(MockMvcResultMatchers.status().isForbidden());
	}

}