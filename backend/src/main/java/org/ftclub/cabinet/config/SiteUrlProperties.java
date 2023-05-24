package org.ftclub.cabinet.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class SiteUrlProperties {

	@Value("${spring.server.fe-host}")
	private String feHost;
}
