package org.ftclub.cabinet.utils.overdue.manager;

import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.service.CabinetService;
import org.ftclub.cabinet.config.GmailProperties;
import org.ftclub.cabinet.config.MailOverdueProperties;
import org.ftclub.cabinet.dto.ActiveLentHistoryDto;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.utils.mail.EmailSender;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailException;

import javax.mail.MessagingException;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
public class OverdueManagerUnitTest {

	private static ActiveLentHistoryDto activeLentHistoryDto;
	private static GmailProperties gmailProperties;
	@Mock
	private CabinetService cabinetService = mock(CabinetService.class);
	@Mock
	private EmailSender emailSender = mock(EmailSender.class);
	@Mock(lenient = true)
	private MailOverdueProperties mailOverdueProperties = mock(MailOverdueProperties.class);
	@InjectMocks
	private OverdueManager overdueManager;

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

	/**
	 * 이 테스트에 대한 내용은 매우 중대해서 모두가 읽어야 함*******************************************
	 * 현재 유닛 테스트에서 처리되지 않은 흐름이 있음(FcmManager).
	 * 그러나 해당 로직에 대한 호출을 검증하지 않은(까먹은) 상태로 nullPointerException이 발생했음에도 테스트가 통과하는 문제가 발생함.
	 * 이 문제는 해당 익셉션이 발생하더라도 테스트에서 검증하는 호출들이 모두 이루어졌기 때문임.
	 * 따라서 유닛 테스트를 작성할 때에 놓치는 부분이 없이(혹은 이후에 로직을 추가하더라도 테스트에 잘) 작성해야함.
	 *
	 * ++
	 *
	 * 현재 익셉션에 대해 e.printStackTrace를 안의 계층에서 호출해버린다.
	 * 이 경우에, 어떠한 익셉션이 발생했음에도 불구하고 코드의 흐름은 정상적으로 실행되기 때문에,
	 * 테스트가 정상적으로 실행된 것 처럼 테스트가 파악하게 된다.
	 * -> 이 경우에 아래의 레이어에서 exception을 함부로 try-catch로 처리하고 끝내는 것이 아니라,
	 * 상위 레이어의 exception으로 래핑해서 처리하는 방식을 선택해야할 것이다.
	 * */
	@Test
	@DisplayName("성공: OVERDUE 상태에서 연체 처리")
	void 성공_handleOverdue_OVERDUE() throws MessagingException, MailException {

		given(activeLentHistoryDto.getIsExpired()).willReturn(true);
		given(activeLentHistoryDto.getDaysLeftFromExpireDate()).willReturn(1L);
		given(activeLentHistoryDto.getUserId()).willReturn(1L);
		given(activeLentHistoryDto.getName()).willReturn("hello");
		given(activeLentHistoryDto.getEmail()).willReturn("hello");

		overdueManager.handleOverdue(activeLentHistoryDto);

		then(cabinetService).should().updateStatus(
				activeLentHistoryDto.getCabinetId(),
				CabinetStatus.OVERDUE
		);

		then(mailOverdueProperties).should().getOverdueMailSubject();
		then(mailOverdueProperties).should().getOverdueMailTemplateUrl();
		then(emailSender).should().sendMail(
				activeLentHistoryDto.getName(),
				activeLentHistoryDto.getEmail(),
				mailOverdueProperties.getOverdueMailSubject(),
				mailOverdueProperties.getOverdueMailTemplateUrl()
		);
	}

	@Test
	@DisplayName("성공: SOON_OVERDUE 상태에서 연체 예정 처리")
	@Disabled
	void 성공_handleOverdue_SOON_OVERDUE() throws MessagingException, MailException {
		given(activeLentHistoryDto.getIsExpired()).willReturn(false);
		given(activeLentHistoryDto.getDaysLeftFromExpireDate()).willReturn(-1L);

		overdueManager.handleOverdue(activeLentHistoryDto);

		then(cabinetService).should(never()).updateStatus(
				activeLentHistoryDto.getCabinetId(),
				CabinetStatus.OVERDUE
		);

		then(mailOverdueProperties).should().getSoonOverdueMailSubject();
		then(mailOverdueProperties).should().getSoonOverdueMailTemplateUrl();
		then(emailSender).should().sendMail(
				activeLentHistoryDto.getName(),
				activeLentHistoryDto.getEmail(),
				mailOverdueProperties.getSoonOverdueMailSubject(),
				mailOverdueProperties.getSoonOverdueMailTemplateUrl()
		);
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

		then(mailOverdueProperties).should(never()).getSoonOverdueMailSubject();
		then(mailOverdueProperties).should(never()).getSoonOverdueMailTemplateUrl();
		then(mailOverdueProperties).should(never()).getOverdueMailSubject();
		then(mailOverdueProperties).should(never()).getOverdueMailTemplateUrl();
		then(emailSender).should(never()).sendMail(
				activeLentHistoryDto.getName(),
				activeLentHistoryDto.getEmail(),
				mailOverdueProperties.getSoonOverdueMailSubject(),
				mailOverdueProperties.getSoonOverdueMailTemplateUrl()
		);
		then(emailSender).should(never()).sendMail(
				activeLentHistoryDto.getName(),
				activeLentHistoryDto.getEmail(),
				mailOverdueProperties.getOverdueMailSubject(),
				mailOverdueProperties.getOverdueMailTemplateUrl()
		);
	}
}
