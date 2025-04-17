package org.ftclub.cabinet.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "cabinet.domain-name")
public class DomainProperties {

	private String cookieDomain;
	private String local;
	private String dev;
	private String main;
	private String adminEmail;
	private String userEmail;
	@Value("${cabinet.server.be-host}")
	private String beHost;
	@Value("${cabinet.server.fe-host}")
	private String feHost;
}

