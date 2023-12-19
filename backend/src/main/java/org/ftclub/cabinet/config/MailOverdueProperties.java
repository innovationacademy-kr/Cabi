package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class MailOverdueProperties {

	@Value("${cabinet.alarm.mail.soonoverdue.term}")
	private Long soonOverdueTerm;

	@Value("${cabinet.alarm.mail.overdue.subject}")
	private String overdueMailSubject;

	@Value("${cabinet.alarm.mail.overdue.template}")
	private String overdueMailTemplateUrl;

	@Value("${cabinet.alarm.mail.soonoverdue.subject}")
	private String soonOverdueMailSubject;

	@Value("${cabinet.alarm.mail.soonoverdue.template}")
	private String soonOverdueMailTemplateUrl;
}
