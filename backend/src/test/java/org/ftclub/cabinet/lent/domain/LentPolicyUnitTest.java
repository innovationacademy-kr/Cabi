package org.ftclub.cabinet.lent.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.config.CabinetProperties;
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
		Cabinet mockCabinet = mock(Cabinet.class);
		given(cabinetProperties.getLentTermPrivate()).willReturn(21);
		given(mockCabinet.getLentType()).willReturn(LentType.PRIVATE);

		LocalDateTime expirationDate = lentPolicy.generateExpirationDate(
				current,
				mockCabinet,
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

	/**
	 * 아래의 테스트는 실패합니다. IllegalArgumentException가 아닌 NPE가 나기 때문이죠\ 그렇다면 generateExpirationDate 에 if
	 * (lentType != null) 을 추가해줘야 하는가? => 모르겠음
	 * <p>
	 * Cabinet은 of 를 통해서만 생성 Cabinet.lentType 이 null 인 경우가 있을까? 독립적인 테스트 이므로 작성하는것이 맞는가? Lent 는 주요
	 * 로직인만큼, null 을 막아두었다해도, 예상치 못한 상황을 안전하게 막는것이 맞지않는가?
	 */
	@Test
	@DisplayName("실패: 사물함 상태 null - 개인사물함")
	void 실패_상태없는_사물함_generateExpirationDate() {
		Cabinet mockCabinet = mock(Cabinet.class);
		given(mockCabinet.getLentType()).willReturn(null);

		assertThrows(IllegalArgumentException.class, () -> {
			lentPolicy.generateExpirationDate(
					LocalDateTime.now(),
					mockCabinet,
					null);
		});
	}

	@Test
	@DisplayName("성공: 만료시간무한 설정 - 공유사물함 최초 대여 - AVAILABLE")
	void 성공_공유사물함_최초_대여_generateExpirationDate() {
		Cabinet mockCabinet = mock(Cabinet.class);
		List<LentHistory> mockLentHistorieList = mock(List.class);
		given(mockCabinet.getLentType()).willReturn(LentType.SHARE);
		given(mockCabinet.getStatus()).willReturn(CabinetStatus.AVAILABLE);

		LocalDateTime expiredDate = lentPolicy.generateExpirationDate(LocalDateTime.now(),
				mockCabinet, mockLentHistorieList);

		assertEquals(expiredDate, DateUtil.getInfinityDate());
	}

	@Test
	@DisplayName("성공: 기존만료일자 리턴 - 공유사물함 합류 - LIMITED_AVAILABLE")
	void 성공_공유사물함_합류_기존만료시간_존재_generateExpirationDate() {
		LocalDateTime currentDate = LocalDateTime.now();
		Cabinet mockCabinet = mock(Cabinet.class);
		LentHistory mocklentHistory = mock(LentHistory.class);
		List<LentHistory> mockLentHistorieList = mock(List.class);

		given(mockCabinet.getLentType()).willReturn(LentType.SHARE);
		given(mockCabinet.getStatus()).willReturn(CabinetStatus.LIMITED_AVAILABLE);
		given(mocklentHistory.getExpiredAt()).willReturn(currentDate.plusDays(42));
		given(mockLentHistorieList.get(0)).willReturn(mocklentHistory);

		LocalDateTime expirationDate = lentPolicy.generateExpirationDate(currentDate, mockCabinet,
				mockLentHistorieList);

		assertEquals(expirationDate, currentDate.plusDays(42));
	}

	@Test
	@DisplayName("성공: 기존만료일자 리턴 - 공유사물함 마지막 합류 - FULL")
	void 성공_공유사물함_만석_기존만료시간_존재_generateExpirationDate() {
		LocalDateTime currentDate = LocalDateTime.now();
		Cabinet mockCabinet = mock(Cabinet.class);
		LentHistory mocklentHistory = mock(LentHistory.class);
		List<LentHistory> mockLentHistorieList = mock(List.class);

		given(mockCabinet.getLentType()).willReturn(LentType.SHARE);
		given(mockCabinet.getStatus()).willReturn(CabinetStatus.FULL);
		given(mocklentHistory.getExpiredAt()).willReturn(currentDate.plusDays(42));
		given(mocklentHistory.isSetExpiredAt()).willReturn(true);
		given(mockLentHistorieList.get(0)).willReturn(mocklentHistory);

		LocalDateTime expirationDate = lentPolicy.generateExpirationDate(currentDate, mockCabinet,
				mockLentHistorieList);

		assertEquals(expirationDate, currentDate.plusDays(42));
	}

	@Test
	@DisplayName("성공: 만료일자 새로설정 - 공유사물함 마지막 합류 - FULL")
	void 성공_공유사물함_만석_기존만료시간_설정_generateExpirationDate() {
		LocalDateTime currentDate = LocalDateTime.now();
		Cabinet mockCabinet = mock(Cabinet.class);
		LentHistory mocklentHistory = mock(LentHistory.class);
		List<LentHistory> mockLentHistorieList = mock(List.class);

		given(mockCabinet.getLentType()).willReturn(LentType.SHARE);
		given(mockCabinet.getStatus()).willReturn(CabinetStatus.LIMITED_AVAILABLE);
		given(mocklentHistory.getExpiredAt()).willReturn(currentDate.plusDays(42));
		given(mockLentHistorieList.get(0)).willReturn(mocklentHistory);

		LocalDateTime expirationDate = lentPolicy.generateExpirationDate(currentDate, mockCabinet,
				mockLentHistorieList);

		assertEquals(expirationDate, currentDate.plusDays(42));
	}

	@Test
	@DisplayName("성공: 만료일자 새로설정 - 동아리사물함")
	void 성공_동아리사물함_대여시간_설정_generateExpirationDate() {
		LocalDateTime currentDate = LocalDateTime.now();
		Cabinet mockCabinet = mock(Cabinet.class);
		LentHistory mocklentHistory = mock(LentHistory.class);

		given(mockCabinet.getLentType()).willReturn(LentType.CLUB);

		LocalDateTime expirationDate = lentPolicy.generateExpirationDate(currentDate, mockCabinet,
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
	void applyExpirationDate() {
	}

	@Test
	void verifyUserForLent() {
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