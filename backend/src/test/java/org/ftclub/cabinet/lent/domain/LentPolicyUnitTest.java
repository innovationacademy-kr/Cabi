package org.ftclub.cabinet.lent.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.config.CabinetProperties;
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
		given(cabinetProperties.getLentTermPrivate()).willReturn(21);
		LocalDateTime expect = LocalDateTime.now().plusDays(21);
		Cabinet mockCabinet = mock(Cabinet.class);
		given(mockCabinet.getLentType()).willReturn(LentType.PRIVATE);

		LocalDateTime returnedExpirationDate = lentPolicy.generateExpirationDate(
				LocalDateTime.now(),
				mockCabinet,
				null);

		assertEquals(expect.truncatedTo(ChronoUnit.SECONDS),
				returnedExpirationDate.truncatedTo(ChronoUnit.SECONDS));
	}

	/**
	 * Cabinet은 of 를 통해서만 생성
	 * Cabinet.lentType 이 null 인 경우가 있을까?
	 * 독립적인 테스트 이므로 작성하는것이 맞는가?
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
	@DisplayName("성공: 만료일자 설정 - 공유사물함")
	void 성공_공유사물함_최초_대여_generateExpirationDate() {
		LocalDateTime expect = LocalDateTime.now().plusDays(1);
		LocalDateTime currentTime = LocalDateTime.now();
//		lentPolicy.generateExpirationDate(currentTime, );
	}

	@Test
	@DisplayName("성공: 만료일자 설정 - 공유사물함")
	void 성공_공유사물함_나중에_합류_generateExpirationDate() {
		LocalDateTime expect = LocalDateTime.now().plusDays(1);

		LocalDateTime currentTime = LocalDateTime.now();
//		lentPolicy.generateExpirationDate(currentTime, );
	}

	@Test
	@DisplayName("성공: 만료일자 설정 - 동아리사물함")
	void 성공_동아리사물함_generateExpirationDate() {
		LocalDateTime expect = LocalDateTime.now().plusDays(1);

		LocalDateTime currentTime = LocalDateTime.now();
//		lentPolicy.generateExpirationDate(currentTime, );
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