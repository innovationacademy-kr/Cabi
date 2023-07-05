package org.ftclub.cabinet.lent.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.config.CabinetProperties;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.BanType;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.utils.DateUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LentPolicyUnitTest {

	@Mock
	CabinetProperties cabinetProperties = mock(CabinetProperties.class);

	@InjectMocks
	LentPolicyImpl lentPolicy;

	@Test
	@DisplayName("성공: 만료일자 설정 - 개인사물함")
	void 성공_개인사물함_generateExpirationDate() {
		LocalDateTime current = LocalDateTime.now();
		LocalDateTime expect = LocalDateTime.now().plusDays(21);
		Cabinet cabinet = mock(Cabinet.class);

		given(cabinetProperties.getLentTermPrivate()).willReturn(21);
		given(cabinet.getLentType()).willReturn(LentType.PRIVATE);

		LocalDateTime expirationDate = lentPolicy.generateExpirationDate(
				current,
				cabinet,
				null);

		assertEquals(expect.truncatedTo(ChronoUnit.SECONDS),
				expirationDate.truncatedTo(ChronoUnit.SECONDS));
	}

	@Test
	@DisplayName("실패: 대여시간이 과거")
	void 실패_대여시간과거_generateExpirationDate() {
		LocalDateTime past = LocalDateTime.now().minusDays(1);

		assertThrows(IllegalArgumentException.class,
				() -> lentPolicy.generateExpirationDate(past, null, null));
	}

	@Test
	@DisplayName("실패: 대여시간이 미래")
	void 실패_대여시간미래_generateExpirationDate() {
		LocalDateTime past = LocalDateTime.now().plusDays(1);

		assertThrows(IllegalArgumentException.class,
				() -> lentPolicy.generateExpirationDate(past, null, null));
	}

	@Test
	@DisplayName("성공: 만료시간무한 설정 - 공유사물함 최초 대여 - AVAILABLE")
	void 성공_공유사물함_최초_대여_generateExpirationDate() {
		Cabinet cabinet = mock(Cabinet.class);
		List<LentHistory> activeLentHistories = mock(List.class);
		given(cabinet.getLentType()).willReturn(LentType.SHARE);
		given(cabinet.getStatus()).willReturn(CabinetStatus.AVAILABLE);

		LocalDateTime expiredDate = lentPolicy.generateExpirationDate(LocalDateTime.now(),
				cabinet, activeLentHistories);

		assertEquals(expiredDate, DateUtil.getInfinityDate());
	}

	@Test
	@DisplayName("성공: 기존만료일자 리턴 - 공유사물함 합류 - LIMITED_AVAILABLE")
	void 성공_공유사물함_합류_기존만료시간_존재_generateExpirationDate() {
		LocalDateTime currentDate = LocalDateTime.now();
		Cabinet cabinet = mock(Cabinet.class);
		LentHistory activeLentHistories = mock(LentHistory.class);
		List<LentHistory> mockLentHistorieList = mock(List.class);

		given(cabinet.getLentType()).willReturn(LentType.SHARE);
		given(cabinet.getStatus()).willReturn(CabinetStatus.LIMITED_AVAILABLE);
		given(activeLentHistories.getExpiredAt()).willReturn(currentDate.plusDays(42));
		given(mockLentHistorieList.get(0)).willReturn(activeLentHistories);

		LocalDateTime expirationDate = lentPolicy.generateExpirationDate(currentDate, cabinet,
				mockLentHistorieList);

		assertEquals(expirationDate, currentDate.plusDays(42));
	}

	@Test
	@DisplayName("성공: 기존만료일자 리턴 - 공유사물함 마지막 합류 - FULL")
	void 성공_공유사물함_만석_기존만료시간_존재_generateExpirationDate() {
		LocalDateTime currentDate = LocalDateTime.now();
		Cabinet cabinet = mock(Cabinet.class);
		LentHistory activeLentHistories = mock(LentHistory.class);
		List<LentHistory> mockLentHistorieList = mock(List.class);

		given(cabinet.getLentType()).willReturn(LentType.SHARE);
		given(cabinet.getStatus()).willReturn(CabinetStatus.FULL);
		given(activeLentHistories.getExpiredAt()).willReturn(currentDate.plusDays(42));
		given(activeLentHistories.isSetExpiredAt()).willReturn(true);
		given(mockLentHistorieList.get(0)).willReturn(activeLentHistories);

		LocalDateTime expirationDate = lentPolicy.generateExpirationDate(currentDate, cabinet,
				mockLentHistorieList);

		assertEquals(expirationDate, currentDate.plusDays(42));
	}

	@Test
	@DisplayName("성공: 만료일자 새로설정 - 공유사물함 마지막 합류 - FULL")
	void 성공_공유사물함_만석_기존만료시간_설정_generateExpirationDate() {
		LocalDateTime currentDate = LocalDateTime.now();
		Cabinet cabinet = mock(Cabinet.class);
		LentHistory activeLentHistories = mock(LentHistory.class);
		List<LentHistory> mockLentHistorieList = mock(List.class);

		given(cabinet.getLentType()).willReturn(LentType.SHARE);
		given(cabinet.getStatus()).willReturn(CabinetStatus.LIMITED_AVAILABLE);
		given(activeLentHistories.getExpiredAt()).willReturn(currentDate.plusDays(42));
		given(mockLentHistorieList.get(0)).willReturn(activeLentHistories);

		LocalDateTime expirationDate = lentPolicy.generateExpirationDate(currentDate, cabinet,
				mockLentHistorieList);

		assertEquals(expirationDate, currentDate.plusDays(42));
	}

	@Test
	@DisplayName("성공: 만료일자 새로설정 - 동아리사물함")
	void 성공_동아리사물함_대여시간_설정_generateExpirationDate() {
		LocalDateTime currentDate = LocalDateTime.now();
		Cabinet cabinet = mock(Cabinet.class);

		given(cabinet.getLentType()).willReturn(LentType.CLUB);

		LocalDateTime expirationDate = lentPolicy.generateExpirationDate(currentDate, cabinet,
				null);

		assertEquals(expirationDate, DateUtil.getInfinityDate());
	}


	@Disabled
	@Test
	@DisplayName("실패: 잘못된 LentType")
	void 실패_잘못된_대여상태_generateExpirationDate() {
		//??
	}

	@Test
	@DisplayName("성공: ")
	void 성공_applyExpirationDate() {
		LocalDateTime expiredDate = LocalDateTime.now();
		LentHistory activeLentHistories = mock(LentHistory.class);

//		lentPolicy.applyExpirationDate();
	}

	@Test
	@DisplayName("실패: UserRole.User가 아닌 유저")
	void 실패_NO_ROLE_verifyUserForLent() {
		User user = mock(User.class);

		given(user.isUserRole(UserRole.USER)).willReturn(false);
		LentPolicyStatus lentPolicyStatus = lentPolicy.verifyUserForLent(user, null, 0, null);

		assertEquals(LentPolicyStatus.NOT_USER, lentPolicyStatus);
	}

	@Test
	@DisplayName("실패: 기존 대여한 사물함이 존재하는 유저")
	void 실패_ALREADY_LENT_USER_verifyUserForLent() {
		int userActiveLentCount = 2;
		User user = mock(User.class);
		given(user.isUserRole(UserRole.USER)).willReturn(true);

		LentPolicyStatus lentPolicyStatus = lentPolicy.verifyUserForLent(user, null,
				userActiveLentCount, null);

		assertEquals(LentPolicyStatus.ALREADY_LENT_USER, lentPolicyStatus);
	}

	@Test
	@DisplayName("실패: 블랙홀에 빠진 유저")
	void 실패_BLACKHOLED_USER_verifyUserForLent() {
		int userActiveLentCount = 0;
		User user = mock(User.class);
		given(user.isUserRole(UserRole.USER)).willReturn(true);
		given(user.getBlackholedAt()).willReturn(LocalDateTime.now());

		LentPolicyStatus lentPolicyStatus = lentPolicy.verifyUserForLent(user, null,
				userActiveLentCount, null);

		assertEquals(LentPolicyStatus.BLACKHOLED_USER, lentPolicyStatus);
	}

	@Test
	@DisplayName("실패: ALL BAN된 유저")
	void 실패_ALL_BANNED_USER_verifyUserForLent() {
		int userActiveLentCount = 0;
		User user = mock(User.class);
		BanHistory mockBanHistory = mock(BanHistory.class);
		List<BanHistory> mockBanHistoryList = new ArrayList<>();

		given(user.isUserRole(UserRole.USER)).willReturn(true);
		given(mockBanHistory.getBanType()).willReturn(BanType.ALL);
		mockBanHistoryList.add(mockBanHistory);

		LentPolicyStatus lentPolicyStatus = lentPolicy.verifyUserForLent(user, null,
				userActiveLentCount, mockBanHistoryList);

		assertEquals(LentPolicyStatus.ALL_BANNED_USER, lentPolicyStatus);
	}

	@Test
	@DisplayName("실패: 공유사물함 BAN된 유저")
	void 실패_SHARE_BANNED_USER_verifyUserForLent() {
		int userActiveLentCount = 0;
		User user = mock(User.class);
		BanHistory banHistory = mock(BanHistory.class);
		List<BanHistory> userActiveBanList = new ArrayList<>();
		Cabinet cabinet = mock(Cabinet.class);

		given(cabinet.isLentType(LentType.SHARE)).willReturn(true);
		given(user.isUserRole(UserRole.USER)).willReturn(true);
		given(banHistory.getBanType()).willReturn(BanType.SHARE);
		userActiveBanList.add(banHistory);

		LentPolicyStatus lentPolicyStatus = lentPolicy.verifyUserForLent(user, cabinet,
				userActiveLentCount, userActiveBanList);

		assertEquals(LentPolicyStatus.SHARE_BANNED_USER, lentPolicyStatus);
	}

	@Test
	@DisplayName("성공: 공유사물함 BAN - 공유사물함 이외 대여")
	void 성공_SHAREBANNED_LENT_OTHER_verifyUserForLent() {
		int userActiveLentCount = 0;
		User user = mock(User.class);
		BanHistory banHistory = mock(BanHistory.class);
		List<BanHistory> userActiveBanList = new ArrayList<>();
		Cabinet cabinet = mock(Cabinet.class);

		given(cabinet.isLentType(LentType.SHARE)).willReturn(false);
		given(user.isUserRole(UserRole.USER)).willReturn(true);
		given(banHistory.getBanType()).willReturn(BanType.SHARE);
		userActiveBanList.add(banHistory);

		LentPolicyStatus lentPolicyStatus = lentPolicy.verifyUserForLent(user, cabinet,
				userActiveLentCount, userActiveBanList);

		assertEquals(LentPolicyStatus.FINE, lentPolicyStatus);
	}


	@Test
	@DisplayName("성공: 유저의 밴 기록 없음")
	void 성공_NO_BANHISTORY_verifyUserForLent() {
		int userActiveLentCount = 0;
		User user = mock(User.class);
		given(user.isUserRole(UserRole.USER)).willReturn(true);

		LentPolicyStatus lentPolicyStatus = lentPolicy.verifyUserForLent(user, null,
				userActiveLentCount, null);

		assertEquals(LentPolicyStatus.FINE, lentPolicyStatus);
	}

	@Test
	@DisplayName("성공: 블랙홀 존재하지만, 미래")
	void 성공_BLACKHOLE_IS_FUTURE_verifyUserForLent() {
		int userActiveLentCount = 0;
		LocalDateTime future = LocalDateTime.now().plusDays(1);
		User user = mock(User.class);

		given(user.isUserRole(UserRole.USER)).willReturn(true);
		given(user.getBlackholedAt()).willReturn(future);

		LentPolicyStatus lentPolicyStatus = lentPolicy.verifyUserForLent(user, null,
				userActiveLentCount, null);

		assertEquals(LentPolicyStatus.FINE, lentPolicyStatus);
	}

	@Test
	void verifyCabinetForLent() {
	}

	@Test
	void getDaysForLentTermPrivate() {
	}

	@Test
	void getDaysForLentTermShare() {
	}

	@Test
	void getDaysForNearExpiration() {
	}
}