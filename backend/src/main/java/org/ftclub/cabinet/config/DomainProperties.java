package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class DomainProperties {

	@Value("${spring.oauth2.domain-name.cookie-domain}")
	private String cookieDomain;

	@Value("${spring.oauth2.domain-name.local}")
	private String local;

	@Value("${spring.oauth2.domain-name.dev}")
	private String dev;

	@Value("${spring.oauth2.domain-name.main}")
	private String main;

	@Value("${spring.server.fe-host}")
	private String feHost;

	@Value("${spring.oauth2.domain-name.admin-email}")
	private String adminEmailDomain;

	@Value("${spring.oauth2.domain-name.user-email}")
	private String userEmailDomain;
}

