package org.ftclub.cabinet.utils.overdue.manager;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;

import javax.mail.MessagingException;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.service.CabinetService;
import org.ftclub.cabinet.alarm.config.GmailProperties;
import org.ftclub.cabinet.alarm.config.AlarmProperties;
import org.ftclub.cabinet.dto.ActiveLentHistoryDto;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailException;

// TODO: 2021-10-07 알람 이벤트 핸들러 방식으로 변경 필요
@ExtendWith(MockitoExtension.class)
@Disabled
public class OverdueManagerUnitTest {

	@Mock
	private CabinetService cabinetService = mock(CabinetService.class);
//	@Mock
//	private EmailService emailService = mock(EmailService.class);
	@Mock(lenient = true)
	private AlarmProperties alarmProperties = mock(AlarmProperties.class);
	@InjectMocks
	private OverdueManager overdueManager;
	private static ActiveLentHistoryDto activeLentHistoryDto;
	private static GmailProperties gmailProperties;

	@BeforeAll
	@DisplayName("테스트 전에 공용 객체를 생성합니다.")
	static void setupBeforeAll() {
		activeLentHistoryDto = mock(ActiveLentHistoryDto.class);
		given(activeLentHistoryDto.getUserId()).willReturn(1L);
		given(activeLentHistoryDto.getName()).willReturn("동글동글동그리");
		given(activeLentHistoryDto.getEmail()).willReturn("동글레차.student.42seoul.kr");
		given(activeLentHistoryDto.getCabinetId()).willReturn(1L);

		gmailProperties = mock(GmailProperties.class);
		given(gmailProperties.getMailServerHost()).willReturn("smtp.gmail.com");
		given(gmailProperties.getMailServerPort()).willReturn(587);
		given(gmailProperties.getUsername()).willReturn("까비의부장님사난.gmail.com");
		given(gmailProperties.getPassword()).willReturn("비밀입니다.");
		given(gmailProperties.getUseAuth()).willReturn(true);
		given(gmailProperties.getUseStartTls()).willReturn(true);
		given(gmailProperties.getIsProduction()).willReturn(false);
	}

	@BeforeEach
	@DisplayName("테스트 전에 mailOverdueProperties를 설정한다.")
	void setUp() {
		given(alarmProperties.getSoonOverdueSubject()).willReturn("42CABI 사물함 연체 예정 알림");
		given(alarmProperties.getSoonOverdueMailTemplateUrl()).willReturn(
				"mail/soonOverdue.html");
		given(alarmProperties.getOverdueSubject()).willReturn("42CABI 사물함 연체 알림");
		given(alarmProperties.getOverdueMailTemplateUrl()).willReturn("mail/overdue.html");
		given(alarmProperties.getSoonOverdueTerm()).willReturn(-1L);
	}

	@Test
	@DisplayName("성공: 연체 상황에서 OVERDUE 타입을 반환")
	void 성공_getOverdueType_OVERDUE() {
		given(activeLentHistoryDto.getIsExpired()).willReturn(true);
		given(activeLentHistoryDto.getDaysLeftFromExpireDate()).willReturn(1L);

		Assertions.assertEquals(overdueManager.getOverdueType(activeLentHistoryDto.getIsExpired(),
				activeLentHistoryDto.getDaysLeftFromExpireDate()), OverdueType.OVERDUE);
	}

	@Test
	@DisplayName("성공: 연체 예정 상황에서 SOON_OVERDUE 타입을 반환")
	void 성공_getOverdueType_SOON_OVERDUE() {
		given(activeLentHistoryDto.getIsExpired()).willReturn(false);
		given(activeLentHistoryDto.getDaysLeftFromExpireDate()).willReturn(-1L);

		Assertions.assertEquals(overdueManager.getOverdueType(activeLentHistoryDto.getIsExpired(),
				activeLentHistoryDto.getDaysLeftFromExpireDate()), OverdueType.SOON_OVERDUE);
	}

	@Test
	@DisplayName("성공: 아무것도 아닌 상황에서 NONE 타입을 반환 - 1")
	void 성공_getOverdueType_NONE1() {
		given(activeLentHistoryDto.getIsExpired()).willReturn(false);
		given(activeLentHistoryDto.getDaysLeftFromExpireDate()).willReturn(0L);

		Assertions.assertEquals(overdueManager.getOverdueType(activeLentHistoryDto.getIsExpired(),
				activeLentHistoryDto.getDaysLeftFromExpireDate()), OverdueType.NONE);
	}

	@Test
	@DisplayName("성공: 아무것도 아닌 상황에서 NONE 타입을 반환 - 2")
	void 성공_getOverdueType_NONE2() {
		given(activeLentHistoryDto.getIsExpired()).willReturn(false);
		given(activeLentHistoryDto.getDaysLeftFromExpireDate()).willReturn(-42L);

		Assertions.assertEquals(overdueManager.getOverdueType(activeLentHistoryDto.getIsExpired(),
				activeLentHistoryDto.getDaysLeftFromExpireDate()), OverdueType.NONE);
	}

	@Test
	@DisplayName("성공: OVERDUE 상태에서 연체 처리")
	void 성공_handleOverdue_OVERDUE() throws MessagingException, MailException {
		given(activeLentHistoryDto.getIsExpired()).willReturn(true);
		given(activeLentHistoryDto.getDaysLeftFromExpireDate()).willReturn(1L);

		overdueManager.handleOverdue(activeLentHistoryDto);

		then(cabinetService).should().updateStatus(
				activeLentHistoryDto.getCabinetId(),
				CabinetStatus.OVERDUE
		);

		then(alarmProperties).should().getOverdueSubject();
		then(alarmProperties).should().getOverdueMailTemplateUrl();
//		then(emailService).should().sendMail(
//				activeLentHistoryDto.getName(),
//				activeLentHistoryDto.getEmail(),
//				alarmProperties.getOverdueSubject(),
//				alarmProperties.getOverdueMailTemplateUrl(),
//				new LentExpirationAlarm(activeLentHistoryDto.getDaysLeftFromExpireDate())
//		);
	}

	@Test
	@DisplayName("성공: SOON_OVERDUE 상태에서 연체 예정 처리")
	void 성공_handleOverdue_SOON_OVERDUE() throws MessagingException, MailException {
		given(activeLentHistoryDto.getIsExpired()).willReturn(false);
		given(activeLentHistoryDto.getDaysLeftFromExpireDate()).willReturn(-1L);

		overdueManager.handleOverdue(activeLentHistoryDto);

		then(cabinetService).should(never()).updateStatus(
				activeLentHistoryDto.getCabinetId(),
				CabinetStatus.OVERDUE
		);

		then(alarmProperties).should().getSoonOverdueSubject();
		then(alarmProperties).should().getSoonOverdueMailTemplateUrl();
//		then(emailService).should().sendMail(
//				activeLentHistoryDto.getName(),
//				activeLentHistoryDto.getEmail(),
//				alarmProperties.getSoonOverdueSubject(),
//				alarmProperties.getSoonOverdueMailTemplateUrl(),
//				new LentExpirationImminentAlarm(activeLentHistoryDto.getDaysLeftFromExpireDate())
//		);
	}

	@Test
	@DisplayName("실패: NONE 상태에서는 연체 처리를 안함")
	void 실패_handleOverdue_NONE() throws MessagingException, MailException {
		given(activeLentHistoryDto.getIsExpired()).willReturn(false);
		given(activeLentHistoryDto.getDaysLeftFromExpireDate()).willReturn(0L);

		overdueManager.handleOverdue(activeLentHistoryDto);

		then(cabinetService).should(never()).updateStatus(
				activeLentHistoryDto.getCabinetId(),
				CabinetStatus.OVERDUE
		);

		then(alarmProperties).should(never()).getSoonOverdueSubject();
		then(alarmProperties).should(never()).getSoonOverdueMailTemplateUrl();
		then(alarmProperties).should(never()).getOverdueSubject();
		then(alarmProperties).should(never()).getOverdueMailTemplateUrl();
//		then(emailService).should(never()).sendMail(
//				activeLentHistoryDto.getName(),
//				activeLentHistoryDto.getEmail(),
//				alarmProperties.getSoonOverdueSubject(),
//				alarmProperties.getSoonOverdueMailTemplateUrl(),
//				null
//		);
//		then(emailService).should(never()).sendMail(
//				activeLentHistoryDto.getName(),
//				activeLentHistoryDto.getEmail(),
//				alarmProperties.getOverdueSubject(),
//				alarmProperties.getOverdueMailTemplateUrl(),
//				null
//		);
	}
}
