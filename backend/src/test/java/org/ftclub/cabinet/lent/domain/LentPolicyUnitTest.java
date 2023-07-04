package org.ftclub.cabinet.lent.domain;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import java.time.LocalDateTime;
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
	LentPolicy lentPolicy;

	@Test
	@DisplayName("성공: 만료일자 설정 - 개인사물함")
	void 성공_개인사물함_generateExpirationDate() {
		given(cabinetProperties.getLentTermPrivate()).willReturn(5);
		LocalDateTime expect = LocalDateTime.now().plusDays(5);
		LocalDateTime currentTime = LocalDateTime.now();

		Cabinet mockCabinet = mock(Cabinet.class);
		given(mockCabinet.getLentType()).willReturn(LentType.PRIVATE);
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