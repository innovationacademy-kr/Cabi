package org.ftclub.cabinet.alarm.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class AlarmProperties {

	/*===================== lentSuccess =========================*/
	@Value("${spring.mail.lentSuccess.subject}")
	private String lentSuccessSubject;

	@Value("${spring.mail.lentSuccess.template}")
	private String lentSuccessMailTemplateUrl;

	@Value("${spring.fcm.lentSuccess.template}")
	private String lentSuccessFcmTemplate;

	/*======================= overdue ===========================*/
	@Value("${spring.mail.overdue.subject}")
	private String overdueSubject;

	@Value("${spring.mail.overdue.template}")
	private String overdueMailTemplateUrl;

	@Value("${spring.fcm.overdue.template}")
	private String overdueFcmTemplate;

	/*===================== soonOverdue =========================*/
	@Value("${spring.mail.soonOverdue.term}")
	private Long soonOverdueTerm;

	@Value("${spring.mail.soonOverdue.subject}")
	private String soonOverdueSubject;

	@Value("${spring.mail.soonOverdue.template}")
	private String soonOverdueMailTemplateUrl;

	@Value("${spring.fcm.soonOverdue.template}")
	private String soonOverdueFcmTemplate;

	/*================== extensionIssuance ======================*/
	@Value("${spring.mail.extensionIssuance.subject}")
	private String extensionIssuanceSubject;

	@Value("${spring.mail.extensionIssuance.template}")
	private String extensionIssuanceMailTemplateUrl;

	@Value("${spring.fcm.extensionIssuance.template}")
	private String extensionIssuanceFcmTemplate;

	/*================= extensionExpiration =====================*/
	@Value("${spring.mail.extensionExpiration.term}")
	private Long extensionExpirationTerm;

	@Value("${spring.mail.extensionExpiration.subject}")
	private String extensionExpirationImminentSubject;

	@Value("${spring.mail.extensionExpiration.template}")
	private String extensionExpirationImminentMailTemplateUrl;

	@Value("${spring.fcm.extensionExpiration.template}")
	private String extensionExpirationImminentFcmTemplate;

	/*==================== announcement =========================*/
	@Value("${spring.mail.announcement.subject}")
	private String announcementSubject;

	@Value("${spring.mail.announcement.template}")
	private String announcementMailTemplateUrl;

	@Value("${spring.fcm.announcement.template}")
	private String announcementFcmTemplate;
}
