package org.ftclub.cabinet.config;

import lombok.Data;
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
	private String beHost;
	private String feHost;
	private String adminEmail;
	private String userEmail;
}

