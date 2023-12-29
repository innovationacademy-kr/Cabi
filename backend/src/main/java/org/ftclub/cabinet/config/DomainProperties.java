package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class DomainProperties {

	@Value("${cabinet.domain-name.cookie-domain}")
	private String cookieDomain;

	@Value("${cabinet.domain-name.local}")
	private String local;

	@Value("${cabinet.domain-name.dev}")
	private String dev;

	@Value("${cabinet.domain-name.main}")
	private String main;

	@Value("${cabinet.server.be-host}")
	private String beHost;

	@Value("${cabinet.server.fe-host}")
	private String feHost;

	@Value("${cabinet.domain-name.admin-email}")
	private String adminEmailDomain;

	@Value("${cabinet.domain-name.user-email}")
	private String userEmailDomain;
}

