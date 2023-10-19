package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class AlarmProperties {

	@Value("${alarm.lentSuccess.subject}")
	private String lentSuccessSubject;

	@Value("${alarm.lentSuccess.template}")
	private String lentSuccessTemplate;

	@Value("${alarm.lentExpiration.term}")
	private Long lentExpirationTerm;

	@Value("${alarm.lentExpiration.subject}")
	private String lentExpirationSubject;

	@Value("${alarm.lentExpiration.template}")
	private String lentExpirationTemplate;

	@Value("${alarm.lentExpirationImminent.term}")
	private Long lentExpirationImminentTerm;

	@Value("${alarm.lentExpirationImminent.subject}")
	private String lentExpirationImminentSubject;

	@Value("${alarm.lentExpirationImminent.template}")
	private String lentExpirationImminentTemplate;

	@Value("${alarm.extensionIssuance.subject}")
	private String extensionIssuanceSubject;

	@Value("${alarm.extensionIssuance.template}")
	private String extensionIssuanceTemplate;

	@Value("${alarm.extensionImminent.term}")
	private Long extensionImminentTerm;

	@Value("${alarm.extensionImminent.subject}")
	private String extensionImminentSubject;

	@Value("${alarm.extensionImminent.template}")
	private String extensionImminentTemplate;
}
