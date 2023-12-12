package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class MailOverdueProperties {

	@Value("${spring.mail.soonOverdue.term}")
	private Long soonOverdueTerm;

	@Value("${spring.mail.overdue.subject}")
	private String overdueMailSubject;

	@Value("${spring.mail.overdue.template}")
	private String overdueMailTemplateUrl;

	@Value("${spring.mail.overdue.subject}")
	private String soonOverdueMailSubject;

	@Value("${spring.mail.overdue.template}")
	private String soonOverdueMailTemplateUrl;
}
