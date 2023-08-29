package org.ftclub.cabinet.lent.domain;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LentPolicyUnitTest {

//	@Mock
//	CabinetProperties cabinetProperties = mock(CabinetProperties.class);
//
//	@InjectMocks
//	LentPolicyImpl lentPolicy;
//
//	@Test
//	@DisplayName("성공: 만료일자 설정 - 개인사물함")
//	void 성공_개인사물함_generateExpirationDate() {
//		LocalDateTime current = LocalDateTime.now();
//		LocalDateTime expect = LocalDateTime.now().plusDays(21);
//		given(cabinetProperties.getLentTermPrivate()).willReturn(21);
//
//		Cabinet cabinet = mock(Cabinet.class);
//		given(cabinet.getLentType()).willReturn(LentType.PRIVATE);
//
//		LocalDateTime expirationDate = lentPolicy.generateExpirationDate(
//				current,
//				cabinet,
//				null);
//
//		assertEquals(expect.truncatedTo(ChronoUnit.SECONDS),
//				expirationDate.truncatedTo(ChronoUnit.SECONDS));
//	}
//
//	@Test
//	@DisplayName("실패: 대여시간이 과거")
//	void 실패_대여시간과거_generateExpirationDate() {
//		LocalDateTime past = LocalDateTime.now().minusDays(1);
//
//		assertThrows(IllegalArgumentException.class,
//				() -> lentPolicy.generateExpirationDate(past, null, null));
//	}
//
//	@Test
//	@DisplayName("실패: 대여시간이 미래")
//	void 실패_대여시간미래_generateExpirationDate() {
//		LocalDateTime future = LocalDateTime.now().plusDays(1);
//
//		assertThrows(IllegalArgumentException.class,
//				() -> lentPolicy.generateExpirationDate(future, null, null));
//	}
//
//	@Test
//	@DisplayName("성공: 만료시간무한 설정 - 공유사물함 최초 대여 - AVAILABLE")
//	void 성공_공유사물함_최초_대여_generateExpirationDate() {
//		List<LentHistory> activeLentHistories = new ArrayList<>();
//		Cabinet cabinet = mock(Cabinet.class);
//		given(cabinet.getLentType()).willReturn(LentType.SHARE);
//		LocalDateTime expiredDate = lentPolicy.generateExpirationDate(LocalDateTime.now(),
//				cabinet, activeLentHistories);
//
//		assertEquals(expiredDate, DateUtil.getInfinityDate());
//	}
//
//	@Test
//	@DisplayName("성공: 기존만료일자 리턴 - 공유사물함 합류 - LIMITED_AVAILABLE")
//	void 성공_공유사물함_합류_기존만료시간_존재_generateExpirationDate() {
//		LocalDateTime currentDate = LocalDateTime.now();
//
//		Cabinet cabinet = mock(Cabinet.class);
//		given(cabinet.getLentType()).willReturn(LentType.SHARE);
//		given(cabinet.getStatus()).willReturn(CabinetStatus.LIMITED_AVAILABLE);
//
//		LentHistory activeLentHistory = mock(LentHistory.class);
//		given(activeLentHistory.getExpiredAt()).willReturn(currentDate.plusDays(42));
//		List<LentHistory> lentHistoryList = new ArrayList<>();
//		lentHistoryList.add(activeLentHistory);
//
//		LocalDateTime expirationDate = lentPolicy.generateExpirationDate(currentDate, cabinet,
//				lentHistoryList);
//
//		assertEquals(expirationDate, currentDate.plusDays(42));
//	}
//
//	@Test
//	@DisplayName("성공: 기존만료일자 리턴 - 공유사물함 마지막 합류 - FULL")
//	void 성공_공유사물함_만석_기존만료시간_존재_generateExpirationDate() {
//		LocalDateTime currentDate = LocalDateTime.now();
//
//		Cabinet cabinet = mock(Cabinet.class);
//		given(cabinet.getLentType()).willReturn(LentType.SHARE);
//		given(cabinet.getStatus()).willReturn(CabinetStatus.FULL);
//
//		LentHistory activeLentHistories = mock(LentHistory.class);
//		given(activeLentHistories.getExpiredAt()).willReturn(currentDate.plusDays(42));
//		given(activeLentHistories.isSetExpiredAt()).willReturn(true);
//		List<LentHistory> mockLentHistorieList = new ArrayList<>();
//		mockLentHistorieList.add(activeLentHistories);
//
//		LocalDateTime expirationDate = lentPolicy.generateExpirationDate(currentDate, cabinet,
//				mockLentHistorieList);
//
//		assertEquals(expirationDate, currentDate.plusDays(42));
//	}
//
//	@Test
//	@DisplayName("성공: 만료일자 새로설정 - 공유사물함 마지막 합류 - FULL")
//	void 성공_공유사물함_만석_기존만료시간_설정_generateExpirationDate() {
//		LocalDateTime currentDate = LocalDateTime.now();
//
//		Cabinet cabinet = mock(Cabinet.class);
//		given(cabinet.getLentType()).willReturn(LentType.SHARE);
//		given(cabinet.getStatus()).willReturn(CabinetStatus.LIMITED_AVAILABLE);
//
//		LentHistory activeLentHistories = mock(LentHistory.class);
//		List<LentHistory> mockLentHistoriesList = new ArrayList<>();
//		given(activeLentHistories.getExpiredAt()).willReturn(currentDate.plusDays(42));
//		mockLentHistoriesList.add(activeLentHistories);
//		LocalDateTime expirationDate = lentPolicy.generateExpirationDate(currentDate, cabinet,
//				mockLentHistoriesList);
//
//		assertEquals(expirationDate, currentDate.plusDays(42));
//	}
//
//	@Test
//	@DisplayName("성공: 만료일자 새로설정 - 동아리사물함")
//	void 성공_동아리사물함_대여시간_설정_generateExpirationDate() {
//		LocalDateTime currentDate = LocalDateTime.now();
//		Cabinet cabinet = mock(Cabinet.class);
//		given(cabinet.getLentType()).willReturn(LentType.CLUB);
//
//		LocalDateTime expirationDate = lentPolicy.generateExpirationDate(currentDate, cabinet,
//				null);
//
//		assertEquals(expirationDate, DateUtil.getInfinityDate());
//	}
//
//	@Test
//	@DisplayName("성공: 만료일자 일괄 설정")
//	void 성공_applyExpirationDate() {
//		LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
//		LocalDateTime tomorrow = LocalDateTime.now().plusDays(1);
//
//		LentHistory curHistory = LentHistory.of(LocalDateTime.now(), yesterday, 993L, 9999L);
//		LentHistory realHistory = LentHistory.of(LocalDateTime.now(), yesterday, 992L, 9999L);
//		LentHistory trueHistory = LentHistory.of(LocalDateTime.now(), yesterday, 991L, 9999L);
//
//		List<LentHistory> beforeActiveHistories = new ArrayList<>();
//		beforeActiveHistories.add(trueHistory);
//		beforeActiveHistories.add(realHistory);
//
//		lentPolicy.applyExpirationDate(curHistory, beforeActiveHistories, tomorrow);
//
//		assertEquals(tomorrow, curHistory.getExpiredAt());
//		assertEquals(tomorrow, realHistory.getExpiredAt());
//		assertEquals(tomorrow, trueHistory.getExpiredAt());
//	}
//
//	@Test
//	@DisplayName("실패: 만료일자 과거")
//	void 실패_EXPIREDAT_IS_PAST_applyExpirationDate() {
//		LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
//
//		assertThrows(DomainException.class,
//				() -> lentPolicy.applyExpirationDate(null, null, yesterday));
//
//	}
//
//	@Test
//	@DisplayName("실패: 만료일자 null")
//	void 실패_EXPIREDAT_IS_NULL_applyExpirationDate() {
//
//		assertThrows(DomainException.class,
//				() -> lentPolicy.applyExpirationDate(null, null, null));
//	}
//
//	@Test
//	@DisplayName("실패: UserRole.User가 아닌 유저")
//	void 실패_NO_ROLE_verifyUserForLent() {
//		User user = mock(User.class);
//
//		given(user.isUserRole(UserRole.USER)).willReturn(false);
//		LentPolicyStatus result = lentPolicy.verifyUserForLent(user, null, 0, null);
//
//		assertEquals(LentPolicyStatus.NOT_USER, result);
//	}
//
//	@Test
//	@DisplayName("실패: 기존 대여한 사물함이 존재하는 유저")
//	void 실패_ALREADY_LENT_USER_verifyUserForLent() {
//		int userActiveLentCount = 2;
//		User user = mock(User.class);
//		given(user.isUserRole(UserRole.USER)).willReturn(true);
//
//		LentPolicyStatus result = lentPolicy.verifyUserForLent(user, null,
//				userActiveLentCount, null);
//
//		assertEquals(LentPolicyStatus.ALREADY_LENT_USER, result);
//	}
//
//	/**
//	 * @See {@link LentPolicyImpl#verifyUserForLent(User, Cabinet, int, List)}
//	 * <p>
//	 * 설계 상의 문제로 테스트 코드 비활성화 처리 해두었습니다.
//	 */
////	@Test
////	@DisplayName("실패: 블랙홀 유저")
////	void 실패_BLACKHOLED_USER_verifyUserForLent() {
////		int userActiveLentCount = 0;
////		User user = mock(User.class);
////		given(user.isUserRole(UserRole.USER)).willReturn(true);
////		given(user.getBlackholedAt()).willReturn(LocalDateTime.now());
////
////		LentPolicyStatus result = lentPolicy.verifyUserForLent(user, null,
////				userActiveLentCount, null);
////
////		assertEquals(LentPolicyStatus.BLACKHOLED_USER, result);
////	}
//	@Test
//	@DisplayName("실패: ALL BAN 유저")
//	void 실패_ALL_BANNED_USER_verifyUserForLent() {
//		int userActiveLentCount = 0;
//		User user = mock(User.class);
//		given(user.isUserRole(UserRole.USER)).willReturn(true);
//
//		BanHistory mockBanHistory = mock(BanHistory.class);
//		given(mockBanHistory.getBanType()).willReturn(BanType.ALL);
//		List<BanHistory> mockBanHistoryList = new ArrayList<>();
//		mockBanHistoryList.add(mockBanHistory);
//
//		LentPolicyStatus result = lentPolicy.verifyUserForLent(user, null,
//				userActiveLentCount, mockBanHistoryList);
//
//		assertEquals(LentPolicyStatus.ALL_BANNED_USER, result);
//	}
//
//	@Test
//	@DisplayName("실패: 공유사물함 BAN된 유저")
//	void 실패_SHARE_BANNED_USER_verifyUserForLent() {
//		int userActiveLentCount = 0;
//		User user = mock(User.class);
//		given(user.isUserRole(UserRole.USER)).willReturn(true);
//
//		Cabinet cabinet = mock(Cabinet.class);
//		given(cabinet.isLentType(LentType.SHARE)).willReturn(true);
//
//		BanHistory banHistory = mock(BanHistory.class);
//		given(banHistory.getBanType()).willReturn(BanType.SHARE);
//		List<BanHistory> userActiveBanList = new ArrayList<>();
//		userActiveBanList.add(banHistory);
//
//		LentPolicyStatus result = lentPolicy.verifyUserForLent(user, cabinet,
//				userActiveLentCount, userActiveBanList);
//
//		assertEquals(LentPolicyStatus.SHARE_BANNED_USER, result);
//	}
//
//	@Test
//	@Disabled
//	@DisplayName("성공: 공유사물함 BAN - 공유사물함 이외 대여")
//	void 성공_SHAREBANNED_LENT_OTHER_verifyUserForLent() {
//		int userActiveLentCount = 0;
//		User user = mock(User.class);
//		given(user.isUserRole(UserRole.USER)).willReturn(true);
//
//		BanHistory banHistory = mock(BanHistory.class);
//		given(banHistory.getBanType()).willReturn(BanType.SHARE);
//		List<BanHistory> userActiveBanList = new ArrayList<>();
//		userActiveBanList.add(banHistory);
//
//		Cabinet cabinet = mock(Cabinet.class);
//		given(cabinet.isLentType(LentType.SHARE)).willReturn(false);
//
//		LentPolicyStatus result = lentPolicy.verifyUserForLent(user, cabinet,
//				userActiveLentCount, userActiveBanList);
//
//		assertEquals(LentPolicyStatus.FINE, result);
//	}
//
//
//	@Test
//	@DisplayName("성공: 유저의 밴 기록 없음")
//	void 성공_NO_BANHISTORY_verifyUserForLent() {
//		int userActiveLentCount = 0;
//		User user = mock(User.class);
//		given(user.isUserRole(UserRole.USER)).willReturn(true);
//
//		LentPolicyStatus result = lentPolicy.verifyUserForLent(user, null,
//				userActiveLentCount, null);
//
//		assertEquals(LentPolicyStatus.FINE, result);
//	}
//
//	/**
//	 * @See {@link LentPolicyImpl#verifyUserForLent(User, Cabinet, int, List)}
//	 * <p>
//	 * 설계 상의 문제로 테스트 코드 비활성화 처리 해두었습니다.
//	 */
////	@Test
////	@DisplayName("성공: 유저 미래 블랙홀 예정")
////	void 성공_BLACKHOLE_IS_FUTURE_verifyUserForLent() {
////		int userActiveLentCount = 0;
////		LocalDateTime future = LocalDateTime.now().plusDays(1);
////
////		User user = mock(User.class);
////		given(user.isUserRole(UserRole.USER)).willReturn(true);
////		given(user.getBlackholedAt()).willReturn(future);
////
////		LentPolicyStatus result = lentPolicy.verifyUserForLent(user, null,
////				userActiveLentCount, null);
////
////		assertEquals(LentPolicyStatus.FINE, result);
////	}
//	@Test
//	@DisplayName("실패: FULL캐비넷 대여시도")
//	void 실패_FULL_verifyCabinetForLent() {
//		Cabinet cabinet = mock(Cabinet.class);
//		given(cabinet.getStatus()).willReturn(CabinetStatus.FULL);
//
//		LentPolicyStatus result = lentPolicy.verifyCabinetForLent(cabinet, null, null);
//
//		assertEquals(LentPolicyStatus.FULL_CABINET, result);
//	}
//
//	@Test
//	@DisplayName("실패: 고장 캐비넷 대여시도")
//	void 실패_BROKEN_verifyCabinetForLent() {
//		Cabinet cabinet = mock(Cabinet.class);
//		given(cabinet.getStatus()).willReturn(CabinetStatus.BROKEN);
//
//		LentPolicyStatus result = lentPolicy.verifyCabinetForLent(cabinet, null, null);
//
//		assertEquals(LentPolicyStatus.BROKEN_CABINET, result);
//	}
//
//	@Test
//	@DisplayName("실패: 연체된 캐비넷 대여시도")
//	void 실패_OVERDUE_verifyCabinetForLent() {
//		Cabinet cabinet = mock(Cabinet.class);
//		given(cabinet.getStatus()).willReturn(CabinetStatus.OVERDUE);
//
//		LentPolicyStatus result = lentPolicy.verifyCabinetForLent(cabinet, null, null);
//
//		assertEquals(LentPolicyStatus.OVERDUE_CABINET, result);
//	}
//
//	@Test
//	@DisplayName("성공: 동아리사물함 대여 - LentType.CLUB")
//	void 성공_CLUB_verifyCabinetForLent() {
//		Cabinet cabinet = mock(Cabinet.class);
//		given(cabinet.getStatus()).willReturn(CabinetStatus.AVAILABLE);
//		given(cabinet.isLentType(LentType.CLUB)).willReturn(true);
//
//		LentPolicyStatus result = lentPolicy.verifyCabinetForLent(cabinet, null, null);
//
//		assertEquals(LentPolicyStatus.LENT_CLUB, result);
//	}
//
//	@Test
//	@DisplayName("실패: 공유사물함 - 중간합류 AND 대여기록 NULL - INTERNAL_ERROR")
//	void 실패_LIMITED_AVAILABLE_HISTORY_NULL_verifyCabinetForLent() {
//		Cabinet cabinet = mock(Cabinet.class);
//		given(cabinet.getStatus()).willReturn(CabinetStatus.LIMITED_AVAILABLE);
//		given(cabinet.isLentType(LentType.CLUB)).willReturn(false);
//		given(cabinet.isLentType(LentType.SHARE)).willReturn(true);
//		given(cabinet.isStatus(CabinetStatus.LIMITED_AVAILABLE)).willReturn(true);
//
//		LentPolicyStatus result = lentPolicy.verifyCabinetForLent(cabinet, null, null);
//
//		assertEquals(LentPolicyStatus.INTERNAL_ERROR, result);
//	}
//
//	@Test
//	@DisplayName("실패: 공유사물함 - 중간합류 AND 대여기록 EMPTY - INTERNAL_ERROR")
//	void 실패_LIMITED_AVAILABLE_HISTORY_EMPTY_verifyCabinetForLent() {
//		Cabinet cabinet = mock(Cabinet.class);
//		given(cabinet.getStatus()).willReturn(CabinetStatus.LIMITED_AVAILABLE);
//		given(cabinet.isLentType(LentType.CLUB)).willReturn(false);
//		given(cabinet.isLentType(LentType.SHARE)).willReturn(true);
//		given(cabinet.isStatus(CabinetStatus.LIMITED_AVAILABLE)).willReturn(true);
//
//		List<LentHistory> cabinetLentHistories = new ArrayList<>();
//		LentPolicyStatus result = lentPolicy.verifyCabinetForLent(cabinet, cabinetLentHistories,
//				null);
//
//		assertEquals(LentPolicyStatus.INTERNAL_ERROR, result);
//	}
//
//	@Test
//	@DisplayName("실패: 공유사물함 - 만료기간 임박시점 대여시도 - IMMINENT_EXPIRATION")
//	void 실패_LIMITED_AVAILABLE_IMMINENT_EXPIRATION_verifyCabinetForLent() {
//		LocalDateTime currentTime = LocalDateTime.now();
//
//		given(lentPolicy.getDaysForNearExpiration()).willReturn(5);
//
//		Cabinet cabinet = mock(Cabinet.class);
//		given(cabinet.getStatus()).willReturn(CabinetStatus.LIMITED_AVAILABLE);
//		given(cabinet.isLentType(LentType.CLUB)).willReturn(false);
//		given(cabinet.isLentType(LentType.SHARE)).willReturn(true);
//		given(cabinet.isStatus(CabinetStatus.LIMITED_AVAILABLE)).willReturn(true);
//		// 잔여 : 1일 (입구컷 기준일자 5일)
//		LentHistory lentHistory = mock(LentHistory.class);
//		given(lentHistory.getExpiredAt()).willReturn(currentTime.plusDays(1));
//		List<LentHistory> cabinetLentHistories = new ArrayList<>();
//		cabinetLentHistories.add(lentHistory);
//
//		LentPolicyStatus result = lentPolicy.verifyCabinetForLent(cabinet, cabinetLentHistories,
//				currentTime);
//
//		assertEquals(LentPolicyStatus.IMMINENT_EXPIRATION, result);
//	}
//
//	@Test
//	@DisplayName("성공: 공유사물함 - 만료기간 여유")
//	void 성공_LIMITED_AVAILABLE_JOIN_verifyCabinetForLent() {
//		LocalDateTime currentTime = LocalDateTime.now();
//
//		given(lentPolicy.getDaysForNearExpiration()).willReturn(5);
//
//		// 공유사물함 중간합류
//		Cabinet cabinet = mock(Cabinet.class);
//		given(cabinet.getStatus()).willReturn(CabinetStatus.LIMITED_AVAILABLE);
//		given(cabinet.isLentType(LentType.CLUB)).willReturn(false);
//		given(cabinet.isLentType(LentType.SHARE)).willReturn(true);
//		given(cabinet.isStatus(CabinetStatus.LIMITED_AVAILABLE)).willReturn(true);
//		// 잔여 : 현재일자 + 5일 = 6일 (입구컷 기준일자 5일)
//		LentHistory lentHistory = mock(LentHistory.class);
//		given(lentHistory.getExpiredAt()).willReturn(currentTime.plusDays(6));
//		List<LentHistory> cabinetLentHistories = new ArrayList<>();
//		cabinetLentHistories.add(lentHistory);
//
//		LentPolicyStatus result = lentPolicy.verifyCabinetForLent(cabinet, cabinetLentHistories,
//				currentTime);
//
//		assertEquals(LentPolicyStatus.FINE, result);
//	}
//
//	@Test
//	@Disabled
//	@DisplayName("생략 - 개인사물함 대여 쿨타임")
//	void getDaysForLentTermPrivate() {
//	}
//
//	@Test
//	@Disabled
//	@DisplayName("생략 - 공유사물함 대여 쿨타임")
//	void getDaysForLentTermShare() {
//	}
//
//	@Test
//	@DisplayName("성공: 만료기간 임박날짜 계산")
//	void getDaysForNearExpiration() {
//		given(cabinetProperties.getPenaltyDayShare()).willReturn(3);
//		given(cabinetProperties.getPenaltyDayPadding()).willReturn(2);
//
//		assertEquals(5, lentPolicy.getDaysForNearExpiration());
//	}
}