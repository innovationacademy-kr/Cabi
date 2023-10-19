package org.ftclub.cabinet.alarm.mail.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class MailAlarmProperties {

	@Value("${spring.mail.lentSuccess.subject}")
	private String lentSuccessMailSubject;

	@Value("${spring.mail.lentSuccess.template}")
	private String lentSuccessMailTemplateUrl;

	@Value("${spring.mail.overdue.subject}")
	private String overdueMailSubject;

	@Value("${spring.mail.overdue.template}")
	private String overdueMailTemplateUrl;

	@Value("${spring.mail.soonOverdue.term}")
	private Long soonOverdueTerm;

	@Value("${spring.mail.soonOverdue.subject}")
	private String soonOverdueMailSubject;

	@Value("${spring.mail.soonOverdue.template}")
	private String soonOverdueMailTemplateUrl;

	@Value("${spring.mail.extensionIssuance.subject}")
	private String extensionIssuanceMailSubject;

	@Value("${spring.mail.extensionIssuance.template}")
	private String extensionIssuanceMailTemplateUrl;

	@Value("${spring.mail.extensionExpiration.term}")
	private Long extensionExpirationTerm;

	@Value("${spring.mail.extensionExpiration.subject}")
	private String extensionExpirationImminentMailSubject;

	@Value("${spring.mail.extensionExpiration.template}")
	private String extensionExpirationImminentMailTemplateUrl;
}
