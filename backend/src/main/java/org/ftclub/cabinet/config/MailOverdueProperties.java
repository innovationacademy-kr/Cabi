package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class MailOverdueProperties {

	@Value("${alarm.mail.soonoverdue.term}")
	private Long soonOverdueTerm;

	@Value("${alarm.mail.overdue.subject}")
	private String overdueMailSubject;

	@Value("${alarm.mail.overdue.template}")
	private String overdueMailTemplateUrl;

	@Value("${alarm.mail.soonoverdue.subject}")
	private String soonOverdueMailSubject;

	@Value("${alarm.mail.soonoverdue.template}")
	private String soonOverdueMailTemplateUrl;
}
