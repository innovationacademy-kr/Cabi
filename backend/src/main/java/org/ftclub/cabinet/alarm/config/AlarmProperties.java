package org.ftclub.cabinet.alarm.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class AlarmProperties {

	/*===================== lentSuccess =========================*/
	@Value("${alarm.mail.lentSuccess.subject}")
	private String lentSuccessSubject;

	@Value("${alarm.mail.lentSuccess.template}")
	private String lentSuccessMailTemplateUrl;

	@Value("${alarm.fcm.lentSuccess.template}")
	private String lentSuccessFcmTemplate;

	@Value("${alarm.slack.lentSuccess.template}")
	private String lentSuccessSlackTemplate;

	/*======================= overdue ===========================*/
	@Value("${alarm.mail.overdue.subject}")
	private String overdueSubject;

	@Value("${alarm.mail.overdue.template}")
	private String overdueMailTemplateUrl;

	@Value("${alarm.fcm.overdue.template}")
	private String overdueFcmTemplate;

	@Value("${alarm.slack.overdue.template}")
	private String overdueSlackTemplate;

	/*===================== soonOverdue =========================*/
	@Value("${alarm.mail.soonOverdue.term}")
	private Long soonOverdueTerm;

	@Value("${alarm.mail.soonOverdue.subject}")
	private String soonOverdueSubject;

	@Value("${alarm.mail.soonOverdue.template}")
	private String soonOverdueMailTemplateUrl;

	@Value("${alarm.fcm.soonOverdue.template}")
	private String soonOverdueFcmTemplate;

	@Value("${alarm.slack.soonOverdue.template}")
	private String soonOverdueSlackTemplate;

	/*================== extensionIssuance ======================*/
	@Value("${alarm.mail.extensionIssuance.subject}")
	private String extensionIssuanceSubject;

	@Value("${alarm.mail.extensionIssuance.template}")
	private String extensionIssuanceMailTemplateUrl;

	@Value("${alarm.fcm.extensionIssuance.template}")
	private String extensionIssuanceFcmTemplate;

	@Value("${alarm.slack.extensionIssuance.template}")
	private String extensionIssuanceSlackTemplate;

	/*================= extensionExpiration =====================*/
	@Value("${alarm.mail.extensionExpiration.term}")
	private Long extensionExpirationTerm;

	@Value("${alarm.mail.extensionExpiration.subject}")
	private String extensionExpirationImminentSubject;

	@Value("${alarm.mail.extensionExpiration.template}")
	private String extensionExpirationImminentMailTemplateUrl;

	@Value("${alarm.fcm.extensionExpiration.template}")
	private String extensionExpirationImminentFcmTemplate;

	@Value("${alarm.slack.extensionExpiration.template}")
	private String extensionExpirationImminentSlackTemplate;

	/*==================== announcement =========================*/
	@Value("${alarm.mail.announcement.subject}")
	private String announcementSubject;

	@Value("${alarm.mail.announcement.template}")
	private String announcementMailTemplateUrl;

	@Value("${alarm.fcm.announcement.template}")
	private String announcementFcmTemplate;

	@Value("${alarm.slack.announcement.template}")
	private String announcementSlackTemplate;
}
