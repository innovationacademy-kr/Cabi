package org.ftclub.cabinet.alarm.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class AlarmProperties {

	@Value("${cabinet.production}")
	private Boolean isProduction;

	/*===================== lentSuccess =========================*/
	@Value("${cabinet.alarm.mail.lentSuccess.subject}")
	private String lentSuccessSubject;

	@Value("${cabinet.alarm.mail.lentSuccess.template}")
	private String lentSuccessMailTemplateUrl;

	@Value("${cabinet.alarm.fcm.lentSuccess.template}")
	private String lentSuccessFcmTemplate;

	@Value("${cabinet.alarm.slack.lentSuccess.template}")
	private String lentSuccessSlackTemplate;

	/*======================= overdue ===========================*/
	@Value("${cabinet.alarm.mail.overdue.subject}")
	private String overdueSubject;

	@Value("${cabinet.alarm.mail.overdue.template}")
	private String overdueMailTemplateUrl;

	@Value("${cabinet.alarm.fcm.overdue.template}")
	private String overdueFcmTemplate;

	@Value("${cabinet.alarm.slack.overdue.template}")
	private String overdueSlackTemplate;

	/*===================== soonOverdue =========================*/
	@Value("${cabinet.alarm.mail.soonOverdue.subject}")
	private String soonOverdueSubject;

	@Value("${cabinet.alarm.mail.soonOverdue.template}")
	private String soonOverdueMailTemplateUrl;

	@Value("${cabinet.alarm.fcm.soonOverdue.template}")
	private String soonOverdueFcmTemplate;

	@Value("${cabinet.alarm.slack.soonOverdue.template}")
	private String soonOverdueSlackTemplate;

	@Value("${cabinet.alarm.slack.soonOverdue.template-today}")
	private String soonOverdueByTodayTemplate;

	/*================== extensionIssuance ======================*/
	@Value("${cabinet.alarm.mail.extensionIssuance.subject}")
	private String extensionIssuanceSubject;

	@Value("${cabinet.alarm.mail.extensionIssuance.template}")
	private String extensionIssuanceMailTemplateUrl;

	@Value("${cabinet.alarm.fcm.extensionIssuance.template}")
	private String extensionIssuanceFcmTemplate;

	@Value("${cabinet.alarm.slack.extensionIssuance.template}")
	private String extensionIssuanceSlackTemplate;

	/*================= extensionExpiration =====================*/
	@Value("${cabinet.alarm.mail.extensionExpiration.term}")
	private Long extensionExpirationTerm;

	@Value("${cabinet.alarm.mail.extensionExpiration.subject}")
	private String extensionExpirationImminentSubject;

	@Value("${cabinet.alarm.mail.extensionExpiration.template}")
	private String extensionExpirationImminentMailTemplateUrl;

	@Value("${cabinet.alarm.fcm.extensionExpiration.template}")
	private String extensionExpirationImminentFcmTemplate;

	@Value("${cabinet.alarm.slack.extensionExpiration.template}")
	private String extensionExpirationImminentSlackTemplate;

	/*==================== announcement =========================*/
	@Value("${cabinet.alarm.mail.announcement.subject}")
	private String announcementSubject;

	@Value("${cabinet.alarm.mail.announcement.template}")
	private String announcementMailTemplateUrl;

	@Value("${cabinet.alarm.fcm.announcement.template}")
	private String announcementFcmTemplate;

	@Value("${cabinet.alarm.slack.announcement.template}")
	private String announcementSlackTemplate;

	/*======================== term =============================*/
	@Value("${cabinet.alarm.overdue-term.week-before}")
	private Long overdueTermWeekBefore;

	@Value("${cabinet.alarm.overdue-term.three-days-before}")
	private Long overdueTermThreeDaysBefore;

	@Value("${cabinet.alarm.overdue-term.soon-overdue}")
	private Long overdueTermSoonOverdue;

	@Value("${cabinet.alarm.overdue-term.overdue}")
	private Long overdueTermOverdue;
}
