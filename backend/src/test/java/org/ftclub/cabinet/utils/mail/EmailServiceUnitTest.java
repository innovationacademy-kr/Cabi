package org.ftclub.cabinet.utils.mail;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import org.ftclub.cabinet.alarm.domain.AlarmEvent;
import org.ftclub.cabinet.alarm.domain.LentExpirationAlarm;
import org.ftclub.cabinet.alarm.handler.EmailAlarmSender;
import org.ftclub.cabinet.alarm.config.GmailProperties;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.thymeleaf.ITemplateEngine;
import org.thymeleaf.context.Context;

@ExtendWith(MockitoExtension.class)
public class EmailServiceUnitTest {

	private String name = "testUser";
	private String email = "testEamil@test.com";
	private JavaMailSender javaMailSender = mock(JavaMailSender.class);
	@Mock
	private ITemplateEngine templateEngine;
	@Mock(lenient = true)
	private GmailProperties gmailProperties = mock(GmailProperties.class);

	@InjectMocks
	private EmailAlarmSender emailAlarmSender;


	@BeforeEach
	@DisplayName("테스트 전에 gmailProperties를 설정한다.")
	void setupBeforeEach() {
		given(gmailProperties.getMailServerHost()).willReturn("smtp.gmail.com");
		given(gmailProperties.getMailServerPort()).willReturn(587);
		given(gmailProperties.getUsername()).willReturn("까비의부장님사난.gmail.com");
		given(gmailProperties.getPassword()).willReturn("비밀입니다.");
		given(gmailProperties.getUseAuth()).willReturn(true);
		given(gmailProperties.getUseStartTls()).willReturn(true);
	}

	@Test
	@DisplayName("실패 - 개발 환경에서는 메일을 보내지 않음")
	void 실패_sendMail_개발환경() throws MessagingException, MailException {
		given(gmailProperties.getIsProduction()).willReturn(false);

		emailAlarmSender.send(User.of(name, email, null, UserRole.USER),
				AlarmEvent.of(1L, new LentExpirationAlarm(1L)));

		then(javaMailSender).should(never()).send(any(MimeMessage.class));
	}

	@Test
	@DisplayName("성공 - 개발 환경이 아니면 메일을 보냄")
	void 성공_sendMail_개발환경아님() throws MessagingException, MailException {
		given(gmailProperties.getIsProduction()).willReturn(true);
		given(templateEngine.process(anyString(), any(Context.class))).willReturn("context");
		MimeMessage mimeMessage = new MimeMessage((javax.mail.Session) null);
		given(javaMailSender.createMimeMessage()).willReturn(mimeMessage);

		emailAlarmSender.send(User.of(name, email, null, UserRole.USER),
				AlarmEvent.of(1L, new LentExpirationAlarm(1L)));

		then(javaMailSender).should().send(any(MimeMessage.class));
	}
}
