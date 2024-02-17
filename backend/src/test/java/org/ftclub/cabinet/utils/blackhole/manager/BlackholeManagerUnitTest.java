package org.ftclub.cabinet.utils.blackhole.manager;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@Deprecated
@ExtendWith(MockitoExtension.class)
public class BlackholeManagerUnitTest {

//	@Mock(lenient = true)
//	FtApiProperties ftApiProperties = mock(FtApiProperties.class);
//	@InjectMocks
//	private BlackholeManager blackholeManager;
//	@Mock
//	private FtApiManager ftApiManager = mock(FtApiManager.class);
//	@Mock
//	private LentCommandService lentService = mock(LentCommandService.class);
//	@Mock
//	private UserService userService = mock(UserService.class);
//
//	@BeforeEach
//	@DisplayName("테스트 전에 API 정보를 설정한다.")
//	void setUp() {
//		given(ftApiProperties.getAuthUri()).willReturn("https://urifor.auth");
//		given(ftApiProperties.getClientId()).willReturn("client_id");
//		given(ftApiProperties.getRedirectUri()).willReturn("https://urifor.auth/callback");
//		given(ftApiProperties.getScope()).willReturn("profile");
//		given(ftApiProperties.getGrantType()).willReturn("code");
//	}
//
//	@Test
//	@DisplayName("성공 - 블랙홀인 유저를 강제 반납 및 삭제 처리")
//	void 성공_handleBlackhole_블랙홀에_빠진_유저() throws JsonProcessingException {
//		Long userId = 1L;
//		String name = "지최님";
//		String email = "보고시퍼요지최님🥲.student.42seoul.kr";
////		기존 블랙홀 날짜 = 오늘 날짜 -3
//		LocalDateTime beforeBlackholedAt = LocalDateTime.now().minusDays(3);
//		UserBlackholeDto userBlackholeDto = new UserBlackholeDto(
//				userId,
//				name,
//				email,
//				beforeBlackholedAt
//		);
//		JsonNode jsonUserInfo = mock(JsonNode.class);
//		JsonNode mockCursusUsers = mock(JsonNode.class);
//		JsonNode mockFieldZero = mock(JsonNode.class);
//		JsonNode mockFieldOne = mock(JsonNode.class);
//		ObjectMapper objectMapper = new ObjectMapper();
//		objectMapper.registerModule(new JavaTimeModule());
//		objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
//
////		새 블랙홀 날짜 = 오늘 날짜 -1
//		String StringAfterBlackholedAt = objectMapper.writeValueAsString(
//				LocalDateTime.now().minusDays(1));
//		JsonNode JsonafterBlackholedAt = objectMapper.readTree(StringAfterBlackholedAt);
//
//		given(ftApiManager.getFtUsersInfoByName(name)).willReturn(jsonUserInfo);
//		given(jsonUserInfo.get("cursus_users")).willReturn(mockCursusUsers);
//		lenient().when(mockCursusUsers.get(0)).thenReturn(mockFieldZero);
//		lenient().when(mockCursusUsers.get(1)).thenReturn(mockFieldOne);
//		given(mockFieldOne.get("blackholed_at")).willReturn(
//				JsonafterBlackholedAt);
//		given(mockCursusUsers.size()).willReturn(2);
//
//		blackholeManager.handleBlackhole(userBlackholeDto);
//
////		블랙홀 날짜를 갱신 X
//		then(userService).should(never()).updateUserBlackholedAt(anyLong(), any());
////		블랙홀에 빠진 유저의 사물함 반납 및 유저 삭제 처리
//		then(lentService).should().terminateLentCabinet(userId);
//		then(userService).should().deleteUser(anyLong(), any());
//	}
//
//	@Test
//	@DisplayName("성공 - 카뎃이 아닌 유저를 강제 반납 및 삭제 처리")
//	void 성공_handleBlackhole_카뎃이_아닌_유저() {
//		Long userId = 1L;
//		String name = "정체를 모를 피씨너";
//		String email = "누구냐넌.student.42seoul.kr";
////		기존 블랙홀 날짜 = null
//		LocalDateTime beforeBlackholedAt = null;
//		UserBlackholeDto userBlackholeDto = new UserBlackholeDto(
//				userId,
//				name,
//				email,
//				beforeBlackholedAt
//		);
//
//		given(ftApiManager.getFtUsersInfoByName(name)).willThrow(new HttpClientErrorException(
//				HttpStatus.NOT_FOUND
//		));
//
//		blackholeManager.handleBlackhole(userBlackholeDto);
//
////		블랙홀 날짜를 갱신 X
//		then(userService).should(never()).updateUserBlackholedAt(anyLong(), any());
////		블랙홀에 빠진 유저의 사물함 반납 및 유저 삭제 처리
//		then(lentService).should().terminateLentCabinet(userId);
//		then(userService).should().deleteUser(anyLong(), any());
//	}
//
//	@Test
//	@DisplayName("성공 - 인트라에 없는 유저 강제 반납 및 삭제 처리")
//	void 성공_handleBlackhole_인트라에_없는_유저() {
//		Long userId = 1L;
//		String name = "정체를 모를 누군가";
//		String email = "누구냐넌.student.42seoul.kr";
////		기존 블랙홀 날짜 = null
//		LocalDateTime beforeBlackholedAt = null;
//		UserBlackholeDto userBlackholeDto = new UserBlackholeDto(
//				userId,
//				name,
//				email,
//				beforeBlackholedAt
//		);
//		JsonNode jsonUserInfo = mock(JsonNode.class);
//		JsonNode mockCursusUsers = mock(JsonNode.class);
//		JsonNode mockFieldZero = mock(JsonNode.class);
//		JsonNode mockFieldOne = mock(JsonNode.class);
//
//		given(ftApiManager.getFtUsersInfoByName(name)).willReturn(jsonUserInfo);
//		given(jsonUserInfo.get("cursus_users")).willReturn(mockCursusUsers);
//		lenient().when(mockCursusUsers.get(0)).thenReturn(mockFieldZero);
//		given(mockCursusUsers.size()).willReturn(1);
//
//		blackholeManager.handleBlackhole(userBlackholeDto);
//
////		블랙홀 날짜를 갱신 X
//		then(userService).should(never()).updateUserBlackholedAt(anyLong(), any());
////		블랙홀에 빠진 유저의 사물함 반납 및 유저 삭제 처리
//		then(lentService).should().terminateLentCabinet(userId);
//		then(userService).should().deleteUser(anyLong(), any());
//	}
//
//	@Test
//	@DisplayName("실패 - 블랙홀에 빠지지 않음 (기존 블랙홀 날짜가 오늘 날짜 이전)")
//	void 실패_handleBlackhole_블랙홀에_빠지지_않은_유저_1() throws JsonProcessingException {
//		Long userId = 1L;
//		String name = "노란머리 블랙홀헌터 은비킴";
//		String email = "CPP언능끝내요은비킴@student.42seoul.kr";
////		기존 블랙홀 날짜 = 오늘 날짜 -3
//		LocalDateTime beforeBlackholedAt = LocalDateTime.now().minusDays(3);
//		UserBlackholeDto userBlackholeDto = new UserBlackholeDto(
//				userId,
//				name,
//				email,
//				beforeBlackholedAt
//		);
//		JsonNode jsonUserInfo = mock(JsonNode.class);
//		JsonNode mockCursusUsers = mock(JsonNode.class);
//		JsonNode mockFieldZero = mock(JsonNode.class);
//		JsonNode mockFieldOne = mock(JsonNode.class);
//		ObjectMapper objectMapper = new ObjectMapper();
//		objectMapper.registerModule(new JavaTimeModule());
//		objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
//
////		새 블랙홀 날짜 = 오늘 날짜 +42
//		String StringAfterBlackholedAt = objectMapper.writeValueAsString(
//				LocalDateTime.now().plusDays(42));
//		JsonNode JsonafterBlackholedAt = objectMapper.readTree(StringAfterBlackholedAt);
//
//		given(ftApiManager.getFtUsersInfoByName(name)).willReturn(jsonUserInfo);
//		given(jsonUserInfo.get("cursus_users")).willReturn(mockCursusUsers);
//		lenient().when(mockCursusUsers.get(0)).thenReturn(mockFieldZero);
//		lenient().when(mockCursusUsers.get(1)).thenReturn(mockFieldOne);
//		given(mockFieldOne.get("blackholed_at")).willReturn(
//				JsonafterBlackholedAt);
//		given(mockCursusUsers.size()).willReturn(2);
//
//		blackholeManager.handleBlackhole(userBlackholeDto);
//
////		블랙홀 날짜를 갱신
//		then(userService).should().updateUserBlackholedAt(anyLong(), any());
////		사물함 반납 및 유저 삭제 처리 X
//		then(lentService).should(never()).terminateLentCabinet(userId);
//		then(userService).should(never()).deleteUser(anyLong(), any());
//	}
//
//	@Test
//	@DisplayName("실패 - 블랙홀에 빠지지 않음 (기존 블랙홀 날짜가 오늘 날짜 이후)")
//	void 실패_handleBlackhole_블랙홀에_빠지지_않은_유저_2() throws JsonProcessingException {
//		Long userId = 1L;
//		String name = "블랙홀 1년 남은 동글동글동그리";
//		String email = "동영한@student.42seoul.kr";
////		기존 블랙홀 날짜 = 오늘 날짜 + 365
//		LocalDateTime beforeBlackholedAt = LocalDateTime.now().plusDays(365);
//		UserBlackholeDto userBlackholeDto = new UserBlackholeDto(
//				userId,
//				name,
//				email,
//				beforeBlackholedAt
//		);
//
//		JsonNode jsonUserInfo = mock(JsonNode.class);
//		JsonNode mockCursusUsers = mock(JsonNode.class);
//		JsonNode mockFieldZero = mock(JsonNode.class);
//		JsonNode mockFieldOne = mock(JsonNode.class);
//
////		새 블랙홀 날짜 = null
//		JsonNode JsonafterBlackholedAt = null;
//
//		given(ftApiManager.getFtUsersInfoByName(name)).willReturn(jsonUserInfo);
//		given(jsonUserInfo.get("cursus_users")).willReturn(mockCursusUsers);
//		lenient().when(mockCursusUsers.get(0)).thenReturn(mockFieldZero);
//		lenient().when(mockCursusUsers.get(1)).thenReturn(mockFieldOne);
//		given(mockFieldOne.get("blackholed_at")).willReturn(
//				JsonafterBlackholedAt);
//		given(mockCursusUsers.size()).willReturn(2);
//
//		blackholeManager.handleBlackhole(userBlackholeDto);
//
////		블랙홀 날짜를 갱신 O
//		then(userService).should().updateUserBlackholedAt(anyLong(), any());
////		사물함 반납 및 유저 삭제 처리 X
//		then(lentService).should(never()).terminateLentCabinet(userId);
//		then(userService).should(never()).deleteUser(anyLong(), any());
//	}
//
//	@Test
//	@DisplayName("실패 - 블랙홀에 빠지지 않음 (원래 멤버인 유저)")
//	void 실패_handleBlackhole_블랙홀에_빠지지_않은_유저_3() throws JsonProcessingException {
//		Long userId = 1L;
//		String name = "천재 프론트 개발자 인신";
//		String email = "까버지@student.42seoul.kr";
////		기존 블랙홀 날짜 = null
//		LocalDateTime beforeBlackholedAt = null;
//		UserBlackholeDto userBlackholeDto = new UserBlackholeDto(
//				userId,
//				name,
//				email,
//				beforeBlackholedAt
//		);
//		JsonNode jsonUserInfo = mock(JsonNode.class);
//		JsonNode mockCursusUsers = mock(JsonNode.class);
//		JsonNode mockFieldZero = mock(JsonNode.class);
//		JsonNode mockFieldOne = mock(JsonNode.class);
//
////		새 블랙홀 날짜 = null
//		JsonNode JsonafterBlackholedAt = null;
//
//		given(ftApiManager.getFtUsersInfoByName(name)).willReturn(jsonUserInfo);
//		given(jsonUserInfo.get("cursus_users")).willReturn(mockCursusUsers);
//		lenient().when(mockCursusUsers.get(0)).thenReturn(mockFieldZero);
//		lenient().when(mockCursusUsers.get(1)).thenReturn(mockFieldOne);
//		given(mockFieldOne.get("blackholed_at")).willReturn(
//				JsonafterBlackholedAt);
//		given(mockCursusUsers.size()).willReturn(2);
//
//		blackholeManager.handleBlackhole(userBlackholeDto);
//
////		블랙홀 날짜를 갱신
//		then(userService).should().updateUserBlackholedAt(anyLong(), any());
////		사물함 반납 및 유저 삭제 처리 X
//		then(lentService).should(never()).terminateLentCabinet(userId);
//		then(userService).should(never()).deleteUser(anyLong(), any());
//	}
//
//	@Test
//	@DisplayName("실패 - 블랙홀에 빠지지 않음 (새로 멤버가 된 유저)")
//	void 실패_handleBlackhole_블랙홀에_빠지지_않은_유저_4() {
//		Long userId = 1L;
//		String name = "제이팍은박재범";
//		String email = "멤jpark2버@student.42seoul.kr";
////		기존 블랙홀 날짜 = 오늘 날짜 -3
//		LocalDateTime beforeBlackholedAt = LocalDateTime.now().minusDays(3);
//		UserBlackholeDto userBlackholeDto = new UserBlackholeDto(
//				userId,
//				name,
//				email,
//				beforeBlackholedAt
//		);
//		JsonNode jsonUserInfo = mock(JsonNode.class);
//		JsonNode mockCursusUsers = mock(JsonNode.class);
//		JsonNode mockFieldZero = mock(JsonNode.class);
//		JsonNode mockFieldOne = mock(JsonNode.class);
//
////		새 블랙홀 날짜 = null
//		JsonNode JsonafterBlackholedAt = null;
//
//		given(ftApiManager.getFtUsersInfoByName(name)).willReturn(jsonUserInfo);
//		given(jsonUserInfo.get("cursus_users")).willReturn(mockCursusUsers);
//		lenient().when(mockCursusUsers.get(0)).thenReturn(mockFieldZero);
//		lenient().when(mockCursusUsers.get(1)).thenReturn(mockFieldOne);
//		given(mockFieldOne.get("blackholed_at")).willReturn(
//				JsonafterBlackholedAt);
//		given(mockCursusUsers.size()).willReturn(2);
//
//		blackholeManager.handleBlackhole(userBlackholeDto);
//
////		블랙홀 날짜를 갱신
//		then(userService).should().updateUserBlackholedAt(anyLong(), any());
////		사물함 반납 및 유저 삭제 처리 X
//		then(lentService).should(never()).terminateLentCabinet(userId);
//		then(userService).should(never()).deleteUser(anyLong(), any());
//	}
}
