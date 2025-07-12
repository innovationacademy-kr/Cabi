package org.ftclub.cabinet.presentation;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import javax.transaction.Transactional;
import org.ftclub.cabinet.event.RedisExpirationEventListener;
import org.ftclub.cabinet.jwt.service.JwtRedisService;
import org.ftclub.cabinet.jwt.service.JwtService;
import org.ftclub.cabinet.presentation.domain.Category;
import org.ftclub.cabinet.presentation.domain.Duration;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationLocation;
import org.ftclub.cabinet.presentation.domain.PresentationSlot;
import org.ftclub.cabinet.presentation.repository.PresentationLikeRepository;
import org.ftclub.cabinet.presentation.repository.PresentationRepository;
import org.ftclub.cabinet.presentation.repository.PresentationSlotRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpMethod;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("발표 관련 API 통합 테스트")
class PresentationIntegrationTest {

	@Autowired
	private MockMvc mockMvc;
	@Autowired
	private JwtService jwtService; // Add this line
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private PresentationRepository presentationRepository;
	@Autowired
	private PresentationSlotRepository presentationSlotRepository;
	@Autowired
	private PresentationLikeRepository presentationLikeRepository;

	@MockBean
	private JwtRedisService jwtRedisService;
	@MockBean
	private RedisExpirationEventListener redisExpirationEventListener;

	private User user, otherUser, otherUser2, otherUser3;
	private String userToken, otherUserToken, otherUser2Token, otherUser3Token;

	private Presentation createTestPresentation(User presentationUser, boolean isPublic,
			Category category, String title) {
		PresentationSlot slot = presentationSlotRepository.save(
				new PresentationSlot(LocalDateTime.now().plusDays(1),
						PresentationLocation.BASEMENT));
		return presentationRepository.save(
				Presentation.of(presentationUser, category, Duration.HOUR, title, "summary",
						"outline", "detail", null, false, isPublic, slot));
	}

	private Presentation createAndCancelTestPresentation(User presentationUser, String title) {
		Presentation presentation = createTestPresentation(presentationUser, true, Category.ETC,
				title);
		presentation.cancel();
		return presentationRepository.save(presentation);
	}

	@BeforeEach
	void setUp() {
		user = userRepository.save(User.of("testuser", "testuser@student.42seoul.kr",
				LocalDateTime.now().plusDays(100), "USER"));
		otherUser = userRepository.save(User.of("otheruser", "otheruser@student.42seoul.kr",
				LocalDateTime.now().plusDays(100), "USER"));
		// [수정] 테스트용 사용자 및 토큰 추가
		otherUser2 = userRepository.save(User.of("otheruser2", "otheruser2@student.42seoul.kr",
				LocalDateTime.now().plusDays(100), "USER"));
		otherUser3 = userRepository.save(User.of("otheruser3", "otheruser3@student.42seoul.kr",
				LocalDateTime.now().plusDays(100), "USER"));

		userToken = jwtService.createPairTokens(user.getId(), "USER", user.getEmail(), "ft")
				.getAccessToken();
		otherUserToken = jwtService.createPairTokens(otherUser.getId(), "USER", user.getEmail(),
						"ft")
				.getAccessToken();
		// [수정] 테스트용 사용자 및 토큰 추가
		otherUser2Token = jwtService.createPairTokens(otherUser2.getId(), "USER", user.getEmail(),
						"ft")
				.getAccessToken();
		otherUser3Token = jwtService.createPairTokens(otherUser3.getId(), "USER", user.getEmail(),
						"ft")
				.getAccessToken();
	}

	@Nested
	@DisplayName("좋아요 생성 및 삭제 테스트")
	class LikeTests {

		@Test
		@DisplayName("성공: 좋아요 생성 및 삭제")
		void 성공_좋아요_생성_및_삭제() throws Exception {
			Presentation p = createTestPresentation(user, true, Category.DEVELOP, "좋아요 테스트");

			// 좋아요 생성
			mockMvc.perform(post("/v6/presentations/{presentationId}/likes", p.getId())
							.header("Authorization", "Bearer " + userToken))
					.andExpect(status().isOk());
			// 좋아요 삭제
			mockMvc.perform(delete("/v6/presentations/{presentationId}/likes", p.getId())
							.header("Authorization", "Bearer " + userToken))
					.andExpect(status().isOk());
		}

		@Test
		@DisplayName("실패: 존재하지 않는 발표에 좋아요")
		void 실패_존재하지_않는_발표에_좋아요() throws Exception {
			mockMvc.perform(post("/v6/presentations/{presentationId}/likes", -1L)
							.header("Authorization", "Bearer " + userToken))
					.andExpect(status().isNotFound());
		}

		@Test
		@DisplayName("실패: 이미 좋아요 누른 발표에 다시 좋아요")
		void 실패_이미_좋아요_누른_발표에_다시_좋아요() throws Exception {
			Presentation p = createTestPresentation(user, true, Category.DEVELOP, "중복 좋아요 테스트");
			// 먼저 좋아요
			mockMvc.perform(post("/v6/presentations/{presentationId}/likes", p.getId())
							.header("Authorization", "Bearer " + userToken))
					.andExpect(status().isOk());

			// 다시 좋아요 시도
			mockMvc.perform(post("/v6/presentations/{presentationId}/likes", p.getId())
							.header("Authorization", "Bearer " + userToken))
					.andExpect(status().isBadRequest());
		}

		@Test
		@DisplayName("실패: 좋아요 누르지 않은 발표에 좋아요 취소")
		void 실패_좋아요_누르지_않은_발표에_좋아요_취소() throws Exception {
			Presentation p = createTestPresentation(user, true, Category.DEVELOP, "없는 좋아요 취소 테스트");
			mockMvc.perform(delete("/v6/presentations/{presentationId}/likes", p.getId())
							.header("Authorization", "Bearer " + userToken))
					.andExpect(status().isBadRequest());
		}

		// LikeTests 클래스에 추가
		@Test
		@DisplayName("실패: 다른 사용자의 좋아요 취소")
		void 실패_다른사용자_좋아요_취소() throws Exception {
			Presentation p = createTestPresentation(user, true, Category.DEVELOP, "남의 좋아요");
			// otherUser가 좋아요 생성
			mockMvc.perform(post("/v6/presentations/{presentationId}/likes", p.getId())
							.header("Authorization", "Bearer " + otherUserToken))
					.andExpect(status().isOk());

			// user가 otherUser의 좋아요를 취소 시도
			mockMvc.perform(delete("/v6/presentations/{presentationId}/likes", p.getId())
							.header("Authorization", "Bearer " + userToken))
					.andExpect(status().isBadRequest()); // 또는 isNotFound()
		}

		@Test
		@DisplayName("실패: 취소된 발표에 좋아요 시도")
		void 실패_취소된_발표에_좋아요_시도() throws Exception {
			// given: 취소된 발표를 생성
			Presentation p = createAndCancelTestPresentation(user, "취소된 발표");

			// when & then: 좋아요를 시도하면 Bad Request가 발생해야 함
			mockMvc.perform(post("/v6/presentations/{presentationId}/likes", p.getId())
							.header("Authorization", "Bearer " + userToken))
					.andExpect(status().isBadRequest());
		}

		@Test
		@DisplayName("성공: 여러 사용자가 좋아요 눌렀을 때 개수 정확성 검증")
		void 성공_좋아요_개수_정확성_검증() throws Exception {
			// given: 하나의 발표를 여러 사용자가 좋아요
			Presentation p = createTestPresentation(user, true, Category.DEVELOP, "초인기 발표");
			mockMvc.perform(post("/v6/presentations/{presentationId}/likes", p.getId())
					.header("Authorization", "Bearer " + userToken));
			mockMvc.perform(post("/v6/presentations/{presentationId}/likes", p.getId())
					.header("Authorization", "Bearer " + otherUserToken));
			mockMvc.perform(post("/v6/presentations/{presentationId}/likes", p.getId())
					.header("Authorization", "Bearer " + otherUser2Token));
			mockMvc.perform(post("/v6/presentations/{presentationId}/likes", p.getId())
					.header("Authorization", "Bearer " + otherUser3Token));

			// when & then: 목록 조회 시 좋아요 개수가 4개로 정확히 표시되는지 확인
			mockMvc.perform(get("/v6/presentations")
							.header("Authorization", "Bearer " + userToken))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.content[?(@.title == '초인기 발표')].likeCount").value(4));

			// when & then: 상세 조회 시에도 좋아요 개수가 4개로 정확히 표시되는지 확인
			mockMvc.perform(get("/v6/presentations/{presentationId}", p.getId())
							.header("Authorization", "Bearer " + userToken))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.data.likeCount").value(4));
		}
	}

	@Nested
	@DisplayName("발표 목록 조회 테스트")
	class GetPresentationsTests {

		@BeforeEach
		void setup() {
			createTestPresentation(user, true, Category.DEVELOP, "공개 개발 발표");
			createTestPresentation(user, false, Category.JOB, "비공개 취업 발표");
			createTestPresentation(otherUser, true, Category.STUDY, "다른 유저 공개 발표");
		}

		@Test
		@DisplayName("성공: 익명 유저 - 공개된 발표만 조회")
		void 성공_익명유저_공개발표만_조회() throws Exception {
			mockMvc.perform(get("/v6/presentations"))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.totalElements").value(2))
					.andExpect(jsonPath("$.content[0].title").value("다른 유저 공개 발표"))
					.andExpect(jsonPath("$.content[1].title").value("공개 개발 발표"));
		}

		@Test
		@DisplayName("성공: 인증된 유저 - 모든 발표 조회")
		void 성공_인증유저_모든발표_조회() throws Exception {
			mockMvc.perform(get("/v6/presentations")
							.header("Authorization", "Bearer " + userToken))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.totalElements").value(3));
		}

		@Test
		@DisplayName("성공: 카테고리 필터링 조회")
		void 성공_카테고리_필터링_조회() throws Exception {
			mockMvc.perform(get("/v6/presentations")
							.param("category", "DEVELOP")
							.header("Authorization", "Bearer " + userToken))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.totalElements").value(1))
					.andExpect(jsonPath("$.content[0].category").value("DEVELOP"));
		}

		@Test
		@DisplayName("성공: 좋아요 순 정렬 조회")
		void 성공_좋아요순_정렬_조회() throws Exception {
			Presentation p1 = createTestPresentation(user, true, Category.ETC, "인기 없는 발표");
			Presentation p2 = createTestPresentation(user, true, Category.ETC, "인기 많은 발표");

			// p2에 좋아요 추가
			mockMvc.perform(post("/v6/presentations/{presentationId}/likes", p2.getId())
					.header("Authorization", "Bearer " + userToken)).andExpect(status().isOk());
			mockMvc.perform(post("/v6/presentations/{presentationId}/likes", p2.getId())
							.header("Authorization", "Bearer " + otherUserToken))
					.andExpect(status().isOk());

			mockMvc.perform(get("/v6/presentations")
							.param("sort", "LIKE")
							.header("Authorization", "Bearer " + userToken))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.content[0].title").value("인기 많은 발표"))
					.andExpect(jsonPath("$.content[0].likeCount").value(2));
		}
	}

	@Nested
	@DisplayName("내가 좋아요 누른 발표 목록 조회 테스트")
	class GetMyLikedPresentationsTests {

		@Test
		@DisplayName("성공: 내가 좋아요 누른 발표 목록 조회")
		void 성공_내가_좋아요_누른_발표_목록_조회() throws Exception {
			Presentation p1 = createTestPresentation(otherUser, true, Category.DEVELOP,
					"내가 좋아요 누른 발표 1");
			Presentation p2 = createTestPresentation(otherUser, true, Category.JOB,
					"내가 좋아요 누른 발표 2");
			Presentation p3 = createTestPresentation(user, true, Category.STUDY, "남이 좋아요 누른 발표");

			// user가 p1, p2에 좋아요
			mockMvc.perform(post("/v6/presentations/{presentationId}/likes", p1.getId())
					.header("Authorization", "Bearer " + userToken)).andExpect(status().isOk());
			mockMvc.perform(post("/v6/presentations/{presentationId}/likes", p2.getId())
					.header("Authorization", "Bearer " + userToken)).andExpect(status().isOk());
			// otherUser가 p3에 좋아요
			mockMvc.perform(post("/v6/presentations/{presentationId}/likes", p3.getId())
							.header("Authorization", "Bearer " + otherUserToken))
					.andExpect(status().isOk());

			mockMvc.perform(get("/v6/presentations/me/likes")
							.header("Authorization", "Bearer " + userToken))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.totalElements").value(2))
					.andExpect(jsonPath("$.content[0].title").value("내가 좋아요 누른 발표 2"))
					.andExpect(jsonPath("$.content[0].likedByMe").value(true))
					.andExpect(jsonPath("$.content[1].title").value("내가 좋아요 누른 발표 1"))
					.andExpect(jsonPath("$.content[1].likedByMe").value(true));
		}

		@Test
		@DisplayName("성공: 좋아요 누른 발표가 없을 때 빈 목록 반환")
		void 성공_좋아요_누른_발표_없을때_빈목록_반환() throws Exception {
			mockMvc.perform(get("/v6/presentations/me/likes")
							.header("Authorization", "Bearer " + userToken))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.totalElements").value(0))
					.andExpect(jsonPath("$.content").isEmpty());
		}

		@Test
		@DisplayName("성공: 내가 좋아요 한 발표가 취소되면 목록에서 제외")
		void 성공_내가_좋아요_한_발표가_취소되면_목록에서_제외() throws Exception {
			// given
			// 1. 다른 유저가 두 개의 발표 생성
			Presentation presentationActive = createTestPresentation(otherUser, true,
					Category.DEVELOP, "살아있는 발표");
			Presentation presentationCanceled = createTestPresentation(otherUser, true,
					Category.JOB, "취소될 발표");

			// 2. 내가 두 발표에 모두 '좋아요'를 누름
			mockMvc.perform(
					post("/v6/presentations/{presentationId}/likes", presentationActive.getId())
							.header("Authorization", "Bearer " + userToken));
			mockMvc.perform(
					post("/v6/presentations/{presentationId}/likes", presentationCanceled.getId())
							.header("Authorization", "Bearer " + userToken));

			// 3. '좋아요'를 누른 발표 중 하나가 취소됨
			presentationCanceled.cancel();
			presentationRepository.save(presentationCanceled);

			// when
			// 4. 내가 '좋아요' 누른 발표 목록을 조회
			mockMvc.perform(get("/v6/presentations/me/likes")
							.header("Authorization", "Bearer " + userToken))
					// then
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.totalElements").value(1)) // 취소된 발표를 제외하고 1개만 조회되어야 함
					.andExpect(jsonPath("$.content[0].title").value("살아있는 발표")) // 살아있는 발표만 남아야 함
					.andExpect(jsonPath(
							"$.content[?(@.title == '취소될 발표')]").doesNotExist()); // 취소된 발표는 없어야 함
		}

	}

	@Nested
	@DisplayName("발표 목록 조회 페이징 및 엣지 케이스 테스트")
	class PresentationPaginationAndEdgeCaseTests {

		@BeforeEach
		void setup() {
			// 25개의 목 데이터 생성 (user와 otherUser가 번갈아가며 생성)
			IntStream.range(0, 25).forEach(i -> {
				User author = (i % 2 == 0) ? user : otherUser;
				Category category = Category.values()[i % (Category.values().length - 1)
						+ 1]; // ALL 제외
				createTestPresentation(author, true, category, "페이징 테스트 " + i);
			});
		}

		@Test
		@DisplayName("성공: 특정 페이지 및 사이즈로 목록 조회")
		void 성공_특정_페이지_및_사이즈_조회() throws Exception {
			mockMvc.perform(get("/v6/presentations")
							.param("page", "2")
							.param("size", "5")
							.header("Authorization", "Bearer " + userToken))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.totalElements").value(25))
					.andExpect(jsonPath("$.totalPage").value(5))
					.andExpect(jsonPath("$.currentPage").value(2))
					.andExpect(jsonPath("$.content.length()").value(5))
					.andExpect(jsonPath("$.last").value(false));
		}

		@Test
		@DisplayName("성공: 마지막 페이지의 아이템 개수 검증")
		void 성공_마지막_페이지_조회() throws Exception {
			// 2개를 더 추가하여 총 27개의 데이터 생성
			createTestPresentation(user, true, Category.ETC, "추가 데이터 1");
			createTestPresentation(user, true, Category.ETC, "추가 데이터 2");

			// 페이지 크기를 10으로 설정 시, 3번째 페이지(index=2)는 7개의 아이템을 가져야 함
			mockMvc.perform(get("/v6/presentations")
							.param("page", "2")
							.param("size", "10")
							.header("Authorization", "Bearer " + userToken))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.totalElements").value(27))
					.andExpect(jsonPath("$.totalPage").value(3))
					.andExpect(jsonPath("$.currentPage").value(2))
					.andExpect(jsonPath("$.content.length()").value(7))
					.andExpect(jsonPath("$.last").value(true));
		}

		@Test
		@DisplayName("성공: ALL 카테고리로 필터링 시")
		void 성공_필터링_ALL_카테고리() throws Exception {
			mockMvc.perform(get("/v6/presentations")
							.param("category", "ALL")
							.param("size", "30") // 모든 결과를 한 페이지에 받기 위함
							.header("Authorization", "Bearer " + userToken))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.totalElements").value(25))
					.andExpect(jsonPath("$.content.length()").value(25));
		}

		@Test
		@DisplayName("성공: 취소된 발표는 목록에서 제외되는지 확인")
		void 성공_취소된_발표_필터링() throws Exception {
			// 취소된 발표 1개 추가
			createAndCancelTestPresentation(user, "취소된 발표");

			// 총 26개의 발표가 있지만, 취소된 1개를 제외하고 25개만 조회되어야 함
			mockMvc.perform(get("/v6/presentations")
							.param("size", "30") // 모든 결과를 한 페이지에 받기 위함
							.header("Authorization", "Bearer " + userToken))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.totalElements").value(25))
					.andExpect(jsonPath("$.content[?(@.title == '취소된 발표')]").doesNotExist());
		}
	}

	private static Stream<Arguments> provideLoginRedirectApiEndpoints() {
		// 예시로 사용할 경로 변수 값들
		String provider = "foo";
		String sku = "item_sku_123"; // 아이템 SKU (Stock Keeping Unit)
		long userId = 99L;
		long presentationId = 1L; // 예시로 사용할 발표 ID
		long commentId = 1L; // 예시로 사용할 댓글 ID

		return Stream.of(
				// --- v5/auth/ 관련 API ---
				Arguments.of(HttpMethod.DELETE, "/v5/auth/link"),
				Arguments.of(HttpMethod.GET, "/v5/auth/link/" + provider), // {provider} 변수 포함
				Arguments.of(HttpMethod.POST, "/v5/auth/logout"),

				// --- v5/items/ 관련 API ---
				Arguments.of(HttpMethod.GET, "/v5/items/"),
				Arguments.of(HttpMethod.GET, "/v5/items/coin"),
				Arguments.of(HttpMethod.POST, "/v5/items/coin"),
				Arguments.of(HttpMethod.GET, "/v5/items/coin/history"),
				Arguments.of(HttpMethod.GET, "/v5/items/history"),
				Arguments.of(HttpMethod.GET, "/v5/items/me"),
				Arguments.of(HttpMethod.POST, "/v5/items/" + sku + "/purchase"), // {sku} 변수 포함
				Arguments.of(HttpMethod.POST, "/v5/items/" + sku + "/use"), // {sku} 변수 포함

				// --- v5/admin/items/ 관련 API ---
				Arguments.of(HttpMethod.GET, "/v5/admin/items/"),
				Arguments.of(HttpMethod.POST, "/v5/admin/items/"),
				Arguments.of(HttpMethod.POST, "/v5/admin/items/assign"),
				Arguments.of(HttpMethod.GET, "/v5/admin/items/users/" + userId), // {userId} 변수 포함

				// --- v5/admin/statistics/ 관련 API ---
				Arguments.of(HttpMethod.GET, "/v5/admin/statistics/coins"),
				Arguments.of(HttpMethod.GET, "/v5/admin/statistics/coins/collect"),
				Arguments.of(HttpMethod.GET, "/v5/admin/statistics/coins/use"),

				// --- v6/admin/presentations/ 관련 API ---
				Arguments.of(HttpMethod.GET, "/v6/admin/presentations"),
				Arguments.of(HttpMethod.GET, "/v6/admin/presentations/" + presentationId),
				Arguments.of(HttpMethod.POST, "/v6/admin/presentations/slots"),
				Arguments.of(HttpMethod.GET,
						"/v6/admin/presentations/" + presentationId + "/comments"),
				Arguments.of(HttpMethod.DELETE,
						"/v6/admin/presentations/" + presentationId + "/comments"),
				Arguments.of(HttpMethod.PATCH,
						"/v6/admin/presentations/" + presentationId + "/comments/" + commentId),
				Arguments.of(HttpMethod.DELETE,
						"/v6/admin/presentations/" + presentationId + "/comments/" + commentId)
		);
	}

	private static Stream<Arguments> provideUnauthorizedApiEndpoints() {
		long presentationId = 1L; // 예시로 사용할 발표 ID
		long commentId = 1L; // 예시로 사용할 댓글 ID
		return Stream.of(
				// --- v6/presentations/ 관련 API ---
				Arguments.of(HttpMethod.POST, "/v6/presentations"),
				Arguments.of(HttpMethod.PATCH, "/v6/presentations/" + presentationId),
				Arguments.of(HttpMethod.POST, "/v6/presentations/" + presentationId + "/likes"),
				Arguments.of(HttpMethod.DELETE, "/v6/presentations/" + presentationId + "/likes"),
				Arguments.of(HttpMethod.POST, "/v6/presentations/" + presentationId + "/comments"),
				Arguments.of(HttpMethod.PATCH,
						"/v6/presentations/" + presentationId + "/comments/" + commentId),
				Arguments.of(HttpMethod.DELETE,
						"/v6/presentations/" + presentationId + "/comments/" + commentId),
				Arguments.of(HttpMethod.GET, "/v6/presentations/me/histories"),
				Arguments.of(HttpMethod.GET, "/v6/presentations/me/likes")
		);
	}

	@Nested
	@DisplayName("익명 유저의 API 권한 없는 요청 테스트")
	class AnonymousUnauthorizedAccessTests {

		@ParameterizedTest
		@MethodSource("org.ftclub.cabinet.presentation.PresentationIntegrationTest#provideLoginRedirectApiEndpoints")
		@DisplayName("실패: 익명 유저가 권한 없는 API 요청 시 302 리다이렉트")
		void 실패_익명_유저_요청_302_리다이렉트(HttpMethod method, String path) throws Exception {
			// Given: Security 설정 확인이 목적임. Request Body는 필요 없음.

			// When & Then: 각 API에 대해 302 리다이렉트 상태 코드가 반환되는지 확인
			mockMvc.perform(request(method, path))
					.andExpect(status().isFound());
		}

		@ParameterizedTest
		@MethodSource("org.ftclub.cabinet.presentation.PresentationIntegrationTest#provideUnauthorizedApiEndpoints")
		@DisplayName("실패: 익명 유저가 권한 없는 API 요청 시 401 에러")
		void 실패_익명_유저_요청_401_에러(HttpMethod method, String path) throws Exception {
			// Given: Security 설정 확인이 목적임. Request Body는 필요 없음.

			// When & Then: 각 API에 대해 401 Unauthorized 상태 코드가 반환되는지 확인
			mockMvc.perform(request(method, path))
					.andExpect(status().isUnauthorized());
		}
	}

}
