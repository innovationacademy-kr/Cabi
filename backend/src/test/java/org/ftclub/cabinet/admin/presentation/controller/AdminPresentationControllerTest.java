package org.ftclub.cabinet.admin.presentation.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import javax.persistence.EntityManager;
import org.ftclub.cabinet.admin.dto.AdminPresentationCalendarItemDto;
import org.ftclub.cabinet.event.RedisExpirationEventListener;
import org.ftclub.cabinet.mapper.PresentationMapper;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.Duration;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationSlot;
import org.ftclub.cabinet.presentation.dto.DataListResponseDto;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.ftclub.cabinet.presentation.repository.PresentationSlotRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AdminPresentationControllerTest {

	private static final String BASE_URL = "/v6/admin/presentations";

	@Autowired
	private MockMvc mockMvc;

	// repositories
	@Autowired
	private PresentationRepository presentationRepository;
	@Autowired
	private PresentationSlotRepository presentationSlotRepository;
	@Autowired
	private UserRepository userRepository;

	// mappers
	@Autowired
	private PresentationMapper presentationMapper;
	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private EntityManager entityManager;

	@MockBean
	private RedisExpirationEventListener redisExpirationEventListener;

	// sample data for realistic tests -> setUp
	private User testUser1, testUser2;
	private PresentationSlot slotMay1, slotMay2, slotJune1;
	private Presentation pMay1, pMay2Canceled, pJune1;

	/**
	 * 실제 샘플 데이터 생성 (테스트 데이터) 로컬에서 돌아가는 init.sql과 겹치지 않도록 데이터 설정
	 */
	@BeforeEach
	void setUp() {
		// test users
		testUser1 = userRepository.save(User.of("testPr1", "testPr1@example.com", null, "USER"));
		testUser2 = userRepository.save(User.of("testPr2", "testPr2@example.com", null, "USER"));

		// test slots
		slotMay1 = presentationSlotRepository.save(
				new PresentationSlot(LocalDateTime.of(2024, 5, 10, 10, 0),
						PresentationLocation.BASEMENT));
		slotMay2 = presentationSlotRepository.save(
				new PresentationSlot(LocalDateTime.of(2024, 5, 20, 14, 0),
						PresentationLocation.BASEMENT));
		slotJune1 = presentationSlotRepository.save(
				new PresentationSlot(LocalDateTime.of(2024, 6, 1, 0, 0),
						PresentationLocation.BASEMENT));        // 경계값: 2024-06-01 00:00

		// test presentations
		pMay1 = Presentation.of(testUser1, Category.DEVELOP, Duration.HOUR,
				"2024-05 test title1", "test summary", "test outline", "test detail",
				null, true, true, slotMay1);
		pMay2Canceled = Presentation.of(testUser2, Category.DEVELOP, Duration.HOUR,
				"2024-05 test title2", "test summary", "test outline", "test detail",
				null, true, true, slotMay2);
		pMay2Canceled.cancel();     // set as canceled(취소된 발표 예시)
		pJune1 = Presentation.of(testUser2, Category.DEVELOP, Duration.HOUR,
				"2024-06 test title", "test summary", "test outline", "test detail",
				null, true, true, slotJune1);

		presentationRepository.saveAll(List.of(pMay1, pMay2Canceled, pJune1));

		entityManager.flush();
	}

	@Test
	@DisplayName("ADMIN - 메인 페이지에서 발표 목록 조회 시, 해당 연월의 취소된 발표를 포함한 모든 데이터가 반환된다.")
	@WithMockUser(roles = "ADMIN")
	void getAdminPresentations_성공() throws Exception {
		// given
		String yearMonthParam = "2024-05";

		List<AdminPresentationCalendarItemDto> expectedDtoList =
				List.of(pMay1, pMay2Canceled).stream()
						.map(presentationMapper::toAdminPresentationCalendarItemDto)
						.collect(Collectors.toList());
		DataListResponseDto<AdminPresentationCalendarItemDto> expectedResponse =
				new DataListResponseDto<>(expectedDtoList);

		// when & then
		MvcResult responseResults = mockMvc.perform(get(BASE_URL)
						.param("yearMonth", yearMonthParam)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andReturn();

		// assertion
		String jsonResponse = responseResults.getResponse().getContentAsString();
		DataListResponseDto<AdminPresentationCalendarItemDto> actualResponse =
				objectMapper.readValue(jsonResponse,
						new TypeReference<>() {
						});

		assertThat(actualResponse)
				.usingRecursiveComparison()
				.isEqualTo(expectedResponse);
	}

	@Test
	@DisplayName("ADMIN - 메인 페이지에서 발표 목록 조회 시, 발표가 없는 연월의 경우 빈 리스트가 반환된다.")
	@WithMockUser(roles = "ADMIN")
	void getAdminPresenataionsEmpryList_성공() throws Exception {
		// given
		String yearMonthParam = "2024-07";

		// when & then
		MvcResult responseResults = mockMvc.perform(get(BASE_URL)
						.param("yearMonth", yearMonthParam)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andReturn();

		// assertion
		String jsonResponse = responseResults.getResponse().getContentAsString();
		DataListResponseDto<AdminPresentationCalendarItemDto> actualResponse =
				objectMapper.readValue(jsonResponse,
						new TypeReference<>() {
						});

		assertThat(actualResponse.getData()).isEmpty();
	}

	@Test
	@DisplayName("ADMIN - 메인 페이지에서 발표 목록 조회 시, 잘못된 파라미터를 입력하면 400 에러가 발생한다.")
	@WithMockUser(roles = "ADMIN")
	void getAdminPresentationsBadRequest_실패() throws Exception {
		// given
		String yearMonthParam = "2024-05-01";

		// when & then
		mockMvc.perform(get(BASE_URL)
						.param("yearMonth", yearMonthParam)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isBadRequest());
	}

	@Test
	@DisplayName("USER - 어드민이 아닌 유저가 발표 목록 조회 시, 403 에러가 발생한다.")
	@WithMockUser(roles = "USER")
	void getAdminPresentationsByUser_실패() throws Exception {
		// given
		String yearMonthParam = "2024-05";

		// when & then
		mockMvc.perform(get(BASE_URL)
						.param("yearMonth", yearMonthParam)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isForbidden());
	}
}
