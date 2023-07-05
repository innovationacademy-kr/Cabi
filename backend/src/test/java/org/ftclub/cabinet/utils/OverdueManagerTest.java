package org.ftclub.cabinet.utils;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.mock;

import org.ftclub.cabinet.config.MailOverdueProperties;
import org.ftclub.cabinet.dto.ActiveLentHistoryDto;
import org.ftclub.cabinet.dto.MasterLoginDto;
import org.ftclub.cabinet.utils.overdue.manager.OverdueManager;
import org.ftclub.cabinet.utils.overdue.manager.OverdueType;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class OverdueManagerTest {

	@Mock(lenient = true)
	MailOverdueProperties mailOverdueProperties = mock(MailOverdueProperties.class);

	@InjectMocks
	OverdueManager overdueManager;

	private static ActiveLentHistoryDto activeLentHistoryDto;


	@BeforeAll
	static void setupBeforeAll() {
		activeLentHistoryDto = mock(ActiveLentHistoryDto.class);
		given(activeLentHistoryDto.getUserId()).willReturn(1L);
		given(activeLentHistoryDto.getName()).willReturn("동글동글동그리");
		given(activeLentHistoryDto.getEmail()).willReturn("동글이.student.42seoul.kr");
		given(activeLentHistoryDto.getCabinetId()).willReturn(1L);
	}

	@BeforeEach
	void setUp() {
		given(mailOverdueProperties.getSoonOverdueMailSubject()).willReturn("42CABI 사물함 연체 예정 알림");
		given(mailOverdueProperties.getSoonOverdueMailTemplateUrl()).willReturn(
				"mail/soonOverdue.html");
		given(mailOverdueProperties.getOverdueMailSubject()).willReturn("42CABI 사물함 연체 알림");
		given(mailOverdueProperties.getOverdueMailTemplateUrl()).willReturn("mail/overdue.html");
		given(mailOverdueProperties.getSoonOverdueTerm()).willReturn(-1L);
	}

	@Test
	@DisplayName("성공: 연체 상황에서 OVERDUE 타입을 반환")
	void 성공_getOverdueType_OVERDUE() {
		given(activeLentHistoryDto.getIsExpired()).willReturn(true);
		given(activeLentHistoryDto.getDaysLeftFromExpireDate()).willReturn(1L);

		Assertions.assertEquals(overdueManager.getOverdueType(true, 1L), OverdueType.OVERDUE);
	}

	@Test
	@DisplayName("성공: 연체 예정 상황에서 SOON_OVERDUE 타입을 반환")
	void 성공_getOverdueType_SOON_OVERDUE() {
		given(activeLentHistoryDto.getIsExpired()).willReturn(false);
		given(activeLentHistoryDto.getDaysLeftFromExpireDate()).willReturn(-1L);

		Assertions.assertEquals(overdueManager.getOverdueType(false, -1L),
				OverdueType.SOON_OVERDUE);
	}

	@Test
	@DisplayName("성공: 아무것도 아닌 상황에서 NONE 타입을 반환 - 1")
	void 성공_getOverdueType_NONE1() {
		given(activeLentHistoryDto.getIsExpired()).willReturn(false);
		given(activeLentHistoryDto.getDaysLeftFromExpireDate()).willReturn(0L);

		Assertions.assertEquals(overdueManager.getOverdueType(false, 0L),
				OverdueType.NONE);
	}

	@Test
	@DisplayName("성공: 아무것도 아닌 상황에서 NONE 타입을 반환 - 2")
	void 성공_getOverdueType_NONE2() {
		given(activeLentHistoryDto.getIsExpired()).willReturn(false);
		given(activeLentHistoryDto.getDaysLeftFromExpireDate()).willReturn(-42L);

		Assertions.assertEquals(overdueManager.getOverdueType(false, -42L),
				OverdueType.NONE);
	}
}
