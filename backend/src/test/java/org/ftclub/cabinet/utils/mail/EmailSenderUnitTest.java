package org.ftclub.cabinet.utils.mail;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.ftclub.cabinet.config.GmailProperties;
import org.junit.jupiter.api.BeforeAll;
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
public class EmailSenderUnitTest {

	@Getter
	@AllArgsConstructor
	private static class Mail {

		String name;
		String to;
		String subject;
		String template;
	}

	private static Mail mail;

	private JavaMailSender javaMailSender = mock(JavaMailSender.class);
	@Mock
	private ITemplateEngine templateEngine;
	@Mock(lenient = true)
	private GmailProperties gmailProperties = mock(GmailProperties.class);

	@InjectMocks
	private EmailSender emailSender;


	@BeforeAll
	@DisplayName("테스트 전에 메일 대상에 대한 정보를 설정한다.")
	static void setupBeforeAll() {
		mail = new Mail(
				"은빅임",
				"은비킴의CPP.student.42seoul.kr",
				"플랜비는없는데요.은비는있어요",
				"mail/overdue"
		);
	}

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

		emailSender.sendMail(mail.getName(), mail.getTo(), mail.getSubject(), mail.getTemplate());

		then(javaMailSender).should(never()).send(
				any(MimeMessage.class)
		);
	}

	@Test
	@DisplayName("성공 - 개발 환경이 아니면 메일을 보냄")
	void 성공_sendMail_개발환경아님() throws MessagingException, MailException {
		given(gmailProperties.getIsProduction()).willReturn(true);
		given(templateEngine.process(anyString(), any(Context.class))).willReturn("context");
		MimeMessage mimeMessage = new MimeMessage((javax.mail.Session) null);
		given(javaMailSender.createMimeMessage()).willReturn(mimeMessage);

		emailSender.sendMail(mail.getName(), mail.getTo(), mail.getSubject(), mail.getTemplate());

		then(javaMailSender).should().send(
				any(MimeMessage.class)
		);
	}
}
