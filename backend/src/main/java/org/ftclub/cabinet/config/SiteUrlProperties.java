package org.ftclub.cabinet.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix="site-url")
@Data
public class SiteUrlProperties {
	private String feHost;
}
